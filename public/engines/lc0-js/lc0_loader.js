/*
 This file is part of Leela Chess Zero.
 Copyright (C) 2018 The LCZero Authors

 Leela Chess is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Leela Chess is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Leela Chess.  If not, see <http://www.gnu.org/licenses/>.
 */

let useWebWorker = 'undefined' != typeof OffscreenCanvas;

if (useWebWorker) {
  CreateLC0Worker = function() {
    return new Promise(function(resolve, reject) {
      resolve(new Worker('lc0.js'));
    });
  };

} else {
  function readFileAsText(url) {
    return new Promise(function(resolve, reject) {
      console.info('loading ' + url);
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200)
          resolve(req.responseText);
        else
          reject(Error(req.statusText));
      };
      req.onerror = function() {
        reject(Error('Network Error'));
      };
      req.send();
    });
  }

  function createWorkerScript(text) {
    const beg = `
const LC0Worker = function() {

  let worker = {

    postMessage: function(message) {
      if (!onmessage) return;
      onmessage({data: message});
    },

    terminate: function() { /* TODO */},

    onmessage: null,

    onerror: null,

  };

  function postMessage(message) {

    let callback=worker.onmessage;
    if (!callback) return;
    callback({data: message});
  }

  function setTerminate(callback) {
    worker.terminate=callback;
  }
  
  `;

    let end = `
  return worker;
};

  `;

    let scriptText = beg + text + end;
    return {id: 'lc0', text: scriptText};
  }

  function loadScript(params) {
    return new Promise(function(resolve, reject) {
      let elementId = '__script__' + params.id;
      if (document.getElementById(elementId)) {
        resolve();
        return;
      }

      const head =
          document.getElementsByTagName('head')[0] || document.documentElement;
      const script = document.createElement('script');
      script.id = elementId;
      script.type = 'text/javascript';
      if (params.url) {
        script.src = params.url;
        script.onload = function() {
          resolve()
        };
        script.onerror = function() {
          reject('could not load ' + url);
        };
      }
      if (params.text) {
        script.text = params.text;
      }
      head.appendChild(script);
      if (params.text) {
        resolve();
      }
    });
  }

  CreateLC0Worker = function() {
    return new Promise(function(resolve, reject) {
      readFileAsText('lc0.js')
          .then(createWorkerScript)
          .then(loadScript)
          .then(function() {
            resolve(new LC0Worker())
          })
          .catch(function(err) {
            reject(err);
          })
    });
  };
}

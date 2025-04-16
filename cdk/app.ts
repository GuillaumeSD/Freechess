import * as cdk from "aws-cdk-lib";
import { AppStack } from "./app-stack";

const app = new cdk.App();

new AppStack(app, "FreechessWebapp", {
  env: { region: "eu-west-3" },
});

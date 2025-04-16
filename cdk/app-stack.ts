import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AccessLevel,
  Distribution,
  ResponseHeadersPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import {
  BucketDeployment,
  CacheControl,
  Source,
} from "aws-cdk-lib/aws-s3-deployment";
import path from "path";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "Bucket", {
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
    });

    const mainDeployment = new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [
        Source.asset(path.resolve(__dirname, "../out"), {
          exclude: ["engines"],
        }),
      ],
      memoryLimit: 512,
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(cdk.Duration.hours(1)),
      ],
    });

    const enginesDeployment = new BucketDeployment(
      this,
      "BucketEnginesDeployment",
      {
        destinationBucket: bucket,
        destinationKeyPrefix: "engines/",
        sources: [Source.asset(path.resolve(__dirname, "../out/engines"))],
        memoryLimit: 512,
        ephemeralStorageSize: cdk.Size.gibibytes(1),
        cacheControl: [
          CacheControl.setPublic(),
          CacheControl.maxAge(cdk.Duration.days(365)),
          CacheControl.immutable(),
        ],
      }
    );
    enginesDeployment.node.addDependency(mainDeployment);

    const originAccessControl = S3BucketOrigin.withOriginAccessControl(bucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    const responseHeadersPolicy = new ResponseHeadersPolicy(
      this,
      "ResponseHeadersPolicy",
      {
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Cross-Origin-Embedder-Policy",
              value: "require-corp",
              override: true,
            },
            {
              header: "Cross-Origin-Opener-Policy",
              value: "same-origin",
              override: true,
            },
          ],
        },
      }
    );

    new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
        },
      ],
      defaultBehavior: {
        origin: originAccessControl,
        responseHeadersPolicy,
      },
    });
  }
}

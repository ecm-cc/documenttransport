# Inquiry process app

tbd 

## Getting Started

Just clone this repo and follow the [build instructions](#build) to get the app up and running.

### Prerequisites

A linux docker container is used for the build and deployment process of the app.
So besides docker (use a recent version) the only thing you need on your local development system is a git client
and an editor or IDE for Node.js .
 
Usually the IDE requires an locally installed [Node.js](https://nodejs.org/en/). Please use at least version 12.14.

### Build

Execute the build with

```
docker-build build
```

This will build a deployment package for aws lambda `dist/lambda` which 
should be used for the production deployment of your app in d.velop cloud.

## Run and test your app locally

Just execute `set DEBUG=* & npm start` to run and test your app on a local dev environment.
Please keep in mind, that some functions like authentication
which require the presence of additional apps (e.g. IdentityProviderApp), 
won't work because these apps are not available on your local system.

## Deployment

Configure the AWS credentials of the created IAM user by using one of the methods described in
[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
For example set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.

**Windows**

```
SET AWS_ACCESS_KEY_ID=<YOUR-ACCESS-KEY-ID>
SET AWS_SECRET_ACCESS_KEY=<YOUR-SECRET-ACCESS-KEY>
```

Deploy the lambda function and all other AWS resources like AWS API Gateway.

```
docker-build deploy
```

The build container uses [Terraform](https://www.terraform.io/) to manage the AWS resources and to deploy
your lambda function. This tool implements a desired state mechanism which means the first execution will take some time
to provision all the required AWS resources. Consecutive executions will only deploy the difference between the desired state
(e.g. the new version of your lambda function) and the state which is already deployed (other AWS resources which won't change
between deployments) and will be much quicker.

### Test your endpoint

The endpoint URLs are logged at the end of the deployment. Just invoke them in a browser to test your app.  
 
```
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

endpoint = [
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/prod/vacationprocess/,
    https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/vacationprocess/
]

```

To watch the current deployment state you can invoke

```
docker-build show 
```

at any time without changing your deployment.

### Deployment of a new app version

Just follow the [deployment](#deployment) steps. A new deployment package for the lambda function will be build automatically.

## Build mechanism
A linux docker container is used to build and deploy the software. This has the advantage, that the build
doesn't rely on specific tools or tool versions that need to be installed on the local development machine or
build server.

During the build the whole application directory is mounted in the docker container. The build targets are
implemented in the `Makefile`.

Two wrappers (`docker-build.bat` and `docker-build.sh`) are provided so you don't have to remember the
rather long docker command.
Furthermore these wrappers provide a little utility function to passthrough all environment variables listed
in the `environment` file from the docker host (that is your development machine or buildserver)
to the build container.

## Acknowledgments

Thanks to the following projects for inspiration

* [README template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)


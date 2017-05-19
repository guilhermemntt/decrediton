#!/bin/bash

set -e

BUILD_OS=${1:-linux}
BUILD_ARCH=${2:-amd64}

DCRD_RELEASE=v1.0.1

DOCKER_IMAGE_TAG=decrediton-builder

DIST_DIR=$(pwd)/dist

DCRD_RELEASE_FILE=decred-$BUILD_OS-$BUILD_ARCH-$DCRD_RELEASE.tar.gz
DCRD_RELEASE_URL=https://github.com/decred/decred-binaries/releases/download/${DCRD_RELEASE}/${DCRD_RELEASE_FILE}

# this will be passed on to `npm package-*`
BUILD_TARGET=$BUILD_OS
if [ "$BUILD_OS" == "darwin" ]; then
  BUILD_TARGET=mac
fi

echo "------------------------------------------"
echo " Building for $BUILD_OS:$BUILD_ARCH "
echo "------------------------------------------"
echo

# initialize directory for build artifacts
if [ -d $DIST_DIR ]; then
  rm -rf $DIST_DIR
fi
mkdir $DIST_DIR && chmod 777 $DIST_DIR

# to build the docker image and push to repo:
#docker build -t $DOCKER_IMAGE_TAG .
#docker tag $DOCKER_IMAGE_TAG jcvernaleo/$DOCKER_IMAGE_TAG
#docker push jcvernaleo/$DOCKER_IMAGE_TAG

docker pull jcvernaleo/$DOCKER_IMAGE_TAG

docker run --rm -it -v $DIST_DIR:/release -v $(pwd):/src jcvernaleo/$DOCKER_IMAGE_TAG /bin/bash -c "\
  . \$HOME/.nvm/nvm.sh && \
  mkdir decrediton && \
  rsync -ra --filter=':- .gitignore'  /src/ decrediton/ && \
  cd decrediton && \
  npm install && \
  npm run lint && \
  mkdir -p bin && \
  curl -L ${DCRD_RELEASE_URL} | tar zxvf - --strip-components=1 -C ./bin/ && \
  npm run package-$BUILD_TARGET && \
  rsync -ra ./release/ /release/"

echo "------------------------------------------"
echo "Build complete, artifacts in $DIST_DIR"
FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:v1.3.3

RUN sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

RUN sudo wget \
  https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.2.1/openapi-generator-cli-6.2.1.jar \
  -O /usr/local/share/openapi-generator-cli.jar

RUN echo 'java -jar /usr/local/share/openapi-generator-cli.jar "$@"' | sudo tee /usr/local/bin/openapi-generator-cli
RUN sudo chmod +x /usr/local/bin/openapi-generator-cli

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install nodejs libgtk2.0-0 libgtk-3-0 libgbm-dev \
  libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

RUN sudo npm install --location=global npm@latest

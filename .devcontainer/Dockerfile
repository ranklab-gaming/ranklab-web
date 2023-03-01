FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:v2.0.0

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

RUN export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get update \
    && sudo apt-get install nodejs libgtk2.0-0 libgtk-3-0 libgbm-dev \
       libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

RUN sudo npm config set prefix /usr/local
RUN sudo npm install -g npm@latest
RUN sudo npm install -g pnpm@latest
RUN sudo pnpm config set global-bin-dir /usr/local/bin
RUN sudo pnpm install -g @openapitools/openapi-generator-cli@latest

FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:v2.0.0

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

RUN export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get update \
    && sudo apt-get -y upgrade \
    && sudo apt-get install nodejs default-jre libgtk2.0-0 libgtk-3-0 libgbm-dev \
       libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

RUN sudo npm config set prefix /usr/local
RUN sudo npm install -g npm@latest
RUN sudo npm install -g pnpm@latest

ENV PATH="$HOME/.local/share/pnpm/bin:${PATH}"
RUN pnpm config set store-dir $HOME/.local/share/pnpm/store
RUN pnpm config set global-bin-dir $HOME/.local/share/pnpm/bin
RUN pnpm config set package-import-method hardlink
RUN pnpm install -g @openapitools/openapi-generator-cli

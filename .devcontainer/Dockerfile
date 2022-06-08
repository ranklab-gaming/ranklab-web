FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:v1.3.2

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install nodejs libgtk2.0-0 libgtk-3-0 libgbm-dev \
    libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

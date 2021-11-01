FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:v1.2.9

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN sudo apt-get update -qq \
    && sudo apt-get install -qq --no-install-recommends nodejs yarn libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y \
    && sudo apt-get clean \
    && sudo rm -rf /var/lib/apt/lists/*

RUN npx cypress install

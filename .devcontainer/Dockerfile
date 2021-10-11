FROM ghcr.io/ranklab-gaming/ranklab-devcontainer:latest

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN sudo apt-get update -qq \
    && sudo apt-get install -qq --no-install-recommends default-jre nodejs yarn wget -y \
    && sudo apt-get clean \
    && sudo rm -rf /var/lib/apt/lists/*

RUN sudo wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.27/swagger-codegen-cli-3.0.27.jar -O /usr/local/share/swagger-codegen-cli.jar
FROM node:latest

ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update -qq \
    && apt-get install -qq --no-install-recommends sudo default-jre -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.27/swagger-codegen-cli-3.0.27.jar -O /usr/local/share/swagger-codegen-cli.jar

RUN userdel node
RUN groupadd --gid $USER_GID vscode
RUN useradd --uid $USER_UID --gid $USER_GID -m vscode -s /bin/bash
RUN echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode
RUN chmod 0440 /etc/sudoers.d/vscode

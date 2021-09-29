FROM node:latest

ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update -qq \
    && apt-get install -qq --no-install-recommends docker.io sudo -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN userdel node
RUN groupadd --gid $USER_GID vscode
RUN useradd --uid $USER_UID --gid $USER_GID -m vscode -s /bin/bash
RUN echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode
RUN chmod 0440 /etc/sudoers.d/vscode
RUN usermod -aG docker vscode

ARG AWS_CONTAINER_REGISTRY_SERVER

FROM ${AWS_CONTAINER_REGISTRY_SERVER}/ranklab-api-production:latest

ENV CARGO_HOME /usr/local
ENV RUSTUP_HOME /usr/local

RUN apt-get update -qq \
  && apt-get install -y --no-install-recommends curl build-essential libssl-dev pkg-config libpq-dev \
  && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly-2021-10-01
RUN cargo install diesel_cli --no-default-features --features postgres
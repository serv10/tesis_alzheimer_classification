FROM mcr.microsoft.com/mssql/server:2022-latest

# Las variables sensibles se pasan desde docker-compose.yml
ENV ACCEPT_EULA=Y
ENV MSSQL_PID=Developer

USER root

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy database objects and scripts
COPY dbo/ /usr/src/app/dbo/
COPY scripts/ /usr/src/app/scripts/
COPY entrypoint.sh /usr/src/app/
COPY deploy-database.sh /usr/src/app/

# Fix line endings and set permissions
RUN sed -i 's/\r$//' /usr/src/app/entrypoint.sh /usr/src/app/deploy-database.sh
RUN chmod +x /usr/src/app/entrypoint.sh /usr/src/app/deploy-database.sh

EXPOSE 1433

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

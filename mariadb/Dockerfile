FROM mariadb:latest

# Copy initialization script to the container
COPY init.sql /docker-entrypoint-initdb.d/

# Environment variables for MariaDB
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=mariadb
ENV MYSQL_USER=db_user
ENV MYSQL_PASSWORD=db_password

# Expose the MariaDB port
EXPOSE 3306


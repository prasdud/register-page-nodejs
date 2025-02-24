set up mysql
    sudo apt install mysql-server


need to flush permisiions
    $ sudo mysql -u root -p
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
    FLUSH PRIVILEGES;


exit and restart mysql

EXIT;
    $ sudo systemctl restart mysql

change credentials
    GOTO index.js and change credentials appropriately

RUNNING
    run the node server using $ node index.js
    start the frontend at port 5500
    use $ npm install MISSING_PACKAGE to install any missing packages
/*
  Research Laboratory Management System
  Script 01 - Creation de l'utilisateur Oracle

  A executer avec un compte administrateur Oracle 11g
  exemple: SYS AS SYSDBA ou SYSTEM.
*/

CREATE USER lab_user IDENTIFIED BY lab_password
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users;

GRANT CONNECT TO lab_user;
GRANT RESOURCE TO lab_user;
GRANT CREATE VIEW TO lab_user;
GRANT CREATE TRIGGER TO lab_user;
GRANT CREATE PROCEDURE TO lab_user;

-- Verification rapide.
SELECT username, account_status
FROM dba_users
WHERE username = 'LAB_USER';

INSERT INTO TB_USER (USERNAME, NAME, EMAIL, PASSWORD, PASSWORD_CHANGED_AT, ROLE_CODE)
VALUES ('oreamo-system', 'System', 'codesver@gmail.com', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', CURRENT_TIMESTAMP, 'ROLE_SYSTEM')
     , ('oreamo-admin', 'Admin', 'codesver@gmail.com', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', CURRENT_TIMESTAMP, 'ROLE_ADMIN')
     , ('oreamo-manager', 'Manager', 'codesver@gmail.com', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', CURRENT_TIMESTAMP, 'ROLE_MANAGER')
     , ('oreamo-user', 'User', 'codesver@gmail.com', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', CURRENT_TIMESTAMP, 'ROLE_USER')
     , ('oreamo', 'Oreamo', 'oreamo@example.com', '$2a$10$rupNcFfUDN8FZXvKt/bglerIVERjSO3kyX9IRYP6Uc5hO4ek1YhCK', NULL, 'ROLE_USER');

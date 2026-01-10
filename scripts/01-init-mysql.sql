
CREATE DATABASE IF NOT EXISTS RegistroEstudiantesDB
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE RegistroEstudiantesDB;

DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS profesores;


CREATE TABLE profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INT NOT NULL DEFAULT 3,
    profesor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materia_profesor FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    materia_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inscripcion_estudiante FOREIGN KEY (estudiante_id)
        REFERENCES estudiantes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_inscripcion_materia FOREIGN KEY (materia_id)
        REFERENCES materias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT unique_inscripcion UNIQUE (estudiante_id, materia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO profesores (nombre, apellido) VALUES
    ('Carlos', 'Rodriguez'),
    ('Maria', 'Garcia'),
    ('Juan', 'Martinez'),
    ('Ana', 'Lopez'),
    ('Pedro', 'Sanchez');

INSERT INTO materias (nombre, creditos, profesor_id) VALUES
    ('Matematicas I', 3, 1),
    ('Matematicas II', 3, 1),
    ('Programacion I', 3, 2),
    ('Programacion II', 3, 2),
    ('Base de Datos I', 3, 3),
    ('Base de Datos II', 3, 3),
    ('Redes I', 3, 4),
    ('Redes II', 3, 4),
    ('Sistemas Operativos', 3, 5),
    ('Arquitectura de Computadores', 3, 5);

CREATE INDEX idx_inscripciones_estudiante ON inscripciones(estudiante_id);
CREATE INDEX idx_inscripciones_materia ON inscripciones(materia_id);
CREATE INDEX idx_materias_profesor ON materias(profesor_id);


CREATE OR REPLACE VIEW vista_estudiantes_materias AS
SELECT
    e.id AS estudiante_id,
    CONCAT(e.nombre, ' ', e.apellido) AS estudiante_nombre,
    e.email,
    m.id AS materia_id,
    m.nombre AS materia_nombre,
    m.creditos,
    CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre
FROM estudiantes e
LEFT JOIN inscripciones i ON e.id = i.estudiante_id
LEFT JOIN materias m ON i.materia_id = m.id
LEFT JOIN profesores p ON m.profesor_id = p.id;

CREATE OR REPLACE VIEW vista_materias_profesores AS
SELECT
    m.id AS materia_id,
    m.nombre AS materia_nombre,
    m.creditos,
    CONCAT(p.nombre, ' ', p.apellido) AS profesor_nombre,
    p.id AS profesor_id
FROM materias m
INNER JOIN profesores p ON m.profesor_id = p.id
ORDER BY p.id, m.id;


DELIMITER $$

CREATE PROCEDURE sp_inscribir_estudiante(
    IN p_estudiante_id INT,
    IN p_materia_id INT
)
BEGIN
    DECLARE v_count INT;
    DECLARE v_profesor_id INT;
    DECLARE v_profesor_existe INT;

    SELECT COUNT(*) INTO v_count
    FROM inscripciones
    WHERE estudiante_id = p_estudiante_id;

    IF v_count >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estudiante ya tiene 3 materias inscritas';
    END IF;

    SELECT profesor_id INTO v_profesor_id
    FROM materias
    WHERE id = p_materia_id;

    SELECT COUNT(*) INTO v_profesor_existe
    FROM inscripciones i
    INNER JOIN materias m ON i.materia_id = m.id
    WHERE i.estudiante_id = p_estudiante_id
    AND m.profesor_id = v_profesor_id;

    IF v_profesor_existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estudiante ya tiene una materia con este profesor';
    END IF;

    INSERT INTO inscripciones (estudiante_id, materia_id)
    VALUES (p_estudiante_id, p_materia_id);
END$$

CREATE PROCEDURE sp_obtener_companeros(IN p_estudiante_id INT)
BEGIN
    SELECT
        m.id AS materia_id,
        m.nombre AS materia_nombre,
        CONCAT(e.nombre, ' ', e.apellido) AS companero_nombre
    FROM inscripciones i1
    INNER JOIN materias m ON i1.materia_id = m.id
    INNER JOIN inscripciones i2 ON m.id = i2.materia_id
    INNER JOIN estudiantes e ON i2.estudiante_id = e.id
    WHERE i1.estudiante_id = p_estudiante_id
    AND i2.estudiante_id != p_estudiante_id
    ORDER BY m.id, e.nombre;
END$$

DELIMITER ;


SELECT * FROM profesores;

SELECT
    m.id,
    m.nombre,
    m.creditos,
    CONCAT(p.nombre, ' ', p.apellido) AS profesor
FROM materias m
INNER JOIN profesores p ON m.profesor_id = p.id
ORDER BY p.id, m.id;

SELECT
    p.id,
    CONCAT(p.nombre, ' ', p.apellido) AS profesor,
    COUNT(m.id) AS total_materias
FROM profesores p
LEFT JOIN materias m ON p.id = m.profesor_id
GROUP BY p.id, p.nombre, p.apellido;


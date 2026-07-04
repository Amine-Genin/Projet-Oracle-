/*
  Research Laboratory Management System
  Script 05 - Triggers Oracle 11g
*/

/*
  Trigger principal du sujet:
  lorsqu'un equipement est affecte a un projet dont le statut est "en cours",
  l'etat de cet equipement devient automatiquement "en utilisation".
*/
CREATE OR REPLACE TRIGGER trg_pe_equip_use
AFTER INSERT OR UPDATE OF id_projet, id_equipement
ON projet_equipement
FOR EACH ROW
DECLARE
  v_statut projet_recherche.statut%TYPE;
BEGIN
  SELECT statut
  INTO v_statut
  FROM projet_recherche
  WHERE id_projet = :NEW.id_projet;

  IF v_statut = 'en cours' THEN
    UPDATE equipement
    SET etat = 'en utilisation'
    WHERE id_equipement = :NEW.id_equipement;
  END IF;
END;
/

/*
  Complement utile:
  si un projet devient "en cours" apres des affectations deja creees,
  tous ses equipements affectes passent aussi en "en utilisation".
*/
CREATE OR REPLACE TRIGGER trg_projet_statut_en_cours
AFTER UPDATE OF statut
ON projet_recherche
FOR EACH ROW
BEGIN
  IF :NEW.statut = 'en cours' AND NVL(:OLD.statut, 'x') <> 'en cours' THEN
    UPDATE equipement e
    SET e.etat = 'en utilisation'
    WHERE e.id_equipement IN (
      SELECT pe.id_equipement
      FROM projet_equipement pe
      WHERE pe.id_projet = :NEW.id_projet
    );
  END IF;
END;
/

/*
  Research Laboratory Management System
  Script 06 - Procedure stockee Oracle 11g

  La procedure retourne les projets en cours, leur budget
  et le nombre de chercheurs impliques.
*/

CREATE OR REPLACE PROCEDURE prc_projets_en_cours (
  p_result OUT SYS_REFCURSOR
) AS
BEGIN
  OPEN p_result FOR
    SELECT
      p.id_projet,
      p.intitule,
      p.budget,
      COUNT(cp.id_chercheur) AS nombre_chercheurs
    FROM projet_recherche p
    LEFT JOIN chercheur_projet cp
      ON cp.id_projet = p.id_projet
    WHERE p.statut = 'en cours'
    GROUP BY p.id_projet, p.intitule, p.budget
    ORDER BY p.intitule;
END prc_projets_en_cours;
/

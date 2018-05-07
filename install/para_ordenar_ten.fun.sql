
/*-------------------------------------------------------------*/
/* Para Ordenar Teniendo Especialmente en cuenta a los Números */
/*-------------------------------------------------------------*/

create or replace function para_ordenar_ten(texto text) returns text
  language sql
as 
$SQL$
  SELECT string_agg(coalesce(lpad(partes[1],10,'0'),partes[2]), '')
    FROM regexp_matches(texto, '(\d+)|(\D+)', 'g') partes
$SQL$;

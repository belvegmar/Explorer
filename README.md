# Explorer
This Repository holds ACME-Explorer Project for ASS subject

The API documentation is on Swagger Folder

# Validaciones

ACTOR:
	- El email tiene que seguir un formato correcto, debe ser único
	- La contraseña debe tener como mínimo 5 caracteres
APPLICATION:
	- Debe existir un viaje al que se asocie la solicitud
	- Debe existir un actor y este debe ser de tipo "Explorer"
FINDER:
	- En el rango de precios, el precio maximo no puede ser menor al precio mínimo.
	- En el rango de fechas, la fecha de inicio no puede ser posterior a la fecha de fin
SPONSORSHIP:
	- El rango de tarifa plana debe ser minimo 0
	- Debe existir un viaje al que se asocie el sponsorship
	- Debe existir un actor de tipo sponsor al que asociar el sponsorship

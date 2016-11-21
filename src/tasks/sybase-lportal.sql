drop database lportal
go

use master
go

create database lportal
go

alter database lportal
on default=1400
go

alter database lportal
with override
go

master..sp_dboption lportal, 'allow nulls by default', true
go

master..sp_dboption lportal, 'select into/bulkcopy/pllsort', true
go

sp_configure 'select for update', 1
go


sp_configure 'default sortorder id', 50, 'utf8'
go

sp_configure "enable unicode conversions", 1
go	

sp_logiosize "8"
go

use lportal
go

sp_logiosize "8"
go

use anydb;

SET FOREIGN_KEY_CHECKS=0;



delete from  `mst_siteunit`;
delete from  `mst_sitemapping`;
delete from  `mst_siteevent`;
delete from  `mst_siteref`;
delete from  `mst_site`;

delete from `mst_sitegroup`;

delete from `mst_land`;

delete from `mst_authdelegate`;
delete from `mst_auth` where `auth_id` <> 'CEO';

delete from `mst_unit`; 
delete from `mst_unitgroup`; 

delete from `mst_dept`; 


delete from `mst_brandpartner`;
delete from `mst_brandref`;
delete from `mst_brand`;
delete from `mst_brandtype`;


delete from `mst_partnerastype`;
delete from `mst_partnerbank`;
delete from `mst_partnercontact`;
delete from `mst_partnersite`;
delete from `mst_partnertrxmodel`;
delete from `mst_partnerref`;
delete from `mst_partnerprop`;
delete from `mst_partner`;


delete from `mst_empluser`;
delete from `mst_empl`;



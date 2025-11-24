-- =======================================================
-- INSERT: Open-Payables-By-Due-Date
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Environment','Environment','string','string','4',1,'in','', 'n','',''),
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Company','Company','dropDown','string','2',2,'in','', 'y','COMPANY_NAMES',''),
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Hold','Hold','dropDown','string','1',3,'in','', 'n','HOLD_VOUCHER_CODE',''),
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Rpt_Name','Rpt Name','string','string','50',4,'in','', 'n','',''),
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Path','Path','string','string','100',5,'in','', 'n','',''),
('Open-Payables-By-Due-Date','Open-Payables-By-Due-Date','AP700PRC',1,'Error_Msg','Error Msg','string','string','50',6,'out','', 'n','','');

-- =======================================================
-- INSERT: Open-Payables-in-Hold-Status
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Environment','Environment','string','string','4',1,'in','', 'n','',''),
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Company','Company','dropDown','string','2',2,'in','', 'y','COMPANY_NAMES',''),
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Hold','Hold','dropDown','string','1',3,'in','', 'n','HOLD_VOUCHER_CODE',''),
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Rpt_Name','Rpt Name','string','string','50',4,'in','', 'n','',''),
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Path','Path','string','string','100',5,'in','', 'n','',''),
('Open-Payables-in-Hold-Status','Open-Payables-in-Hold-Status','AP700PRC',2,'Error_Msg','Error Msg','string','string','50',6,'out','', 'n','','');

-- =======================================================
-- INSERT: Open-Payables-by-Vendor(Aged)
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Environment','ENVID','string','string','4',1,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Company','COMPID','dropDown','string','2',2,'in','', 'y','COMPANY_NAMES',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Date1','DATE1','date','string','6',3,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Date2','DATE2','date','string','6',4,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Date3','DATE3','date','string','6',5,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Date4','DATE4','date','string','6',6,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'SPH_Flag','KYSPH','toggle','string','1',7,'in','<options><option><code>Y</code><label>Yes</label></option><option><code>N</code><label>No</label></option></options>', 'n','','I'),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Rpt_Name','REPNM','string','string','50',8,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Path','PATH','string','string','100',9,'in','', 'n','',''),
('Open-Payables-by-Vendor(Aged)','Open-Payables-by-Vendor(Aged)','AP710PRC',1,'Error_Msg','ERRMSG','string','string','50',10,'out','', 'n','','');

-- =======================================================
-- INSERT: Open-Payables-By-Vendor-Discounts
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Environment','ENVID','string','string','4',1,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Company','COMPID','dropDown','string','2',2,'in','', 'y','COMPANY_NAMES',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Date1','DATE1','date','string','6',3,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Date2','DATE2','date','string','6',4,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Date3','DATE3','date','string','6',5,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Date4','DATE4','date','string','6',6,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'SPH_Flag','KYSPH','toggle','string','1',7,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Rpt_Name','REPNM','string','string','50',8,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Path','PATH','string','string','100',9,'in','', 'n','',''),
('Open-Payables-By-Vendor-Discounts','Open-Payables-By-Vendor-Discounts','AP711PRC',1,'Error_Msg','ERRMSG','string','string','50',10,'out','', 'n','','');

-- =======================================================
-- INSERT: Outstanding-Check-Register
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Environment','ENVID','string','string','1',1,'in','', 'n','','Y'),
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Company','COMPID','string','string','2',2,'in','', 'n','','Y'),
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Date1','DATE1','date','string','6',3,'in','', 'n','','Y'),
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Rpt_Name','REPNM','string','string','50',4,'in','', 'n','','Y'),
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Path','PATH','string','string','100',5,'in','', 'n','','Y'),
('Outstanding-Check-Register','Outstanding-Check-Register','AP340PRC',1,'Error_Msg','ERRMSG','string','string','50',6,'out','', 'n','','Y');


-- =======================================================
-- INSERT: Payment_Cycle_Header_FIle_Create
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_FIle_Create','AP150ACLPRC',1,'Environment','ENVID','string','string','4',1,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_FIle_Create','AP150ACLPRC',1,'UsrID','UsrID','string','string','2',2,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_FIle_Create','AP150ACLPRC',1,'Error_Msg','ERRMSG','string','string','50',3,'out','', 'n','','Y');

-- =======================================================
-- INSERT: Payment_Cycle_Header_Record
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'Environment','ENVID','string','string','4',1,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'UsrID','UsrID','string','string','2',2,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'Company','COMPID','string','string','2',3,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'BKGL','BANK GL NUMBER','string','string','8',4,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'NXCK','NEXT CHECK NUMBER','string','string','6',5,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'CKDT1','CHECK DATE (MMDDYY)','date','string','6',6,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'DATE1','DATE TO PAY BY (MMDDYY)','date','string','6',7,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'FDISC','FORCE DISCOUNT','string','string','1',8,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'KYHOLD','VOUCHERS TO PAY - ('' '',''A'',''E'',''W'')','string','string','1',9,'in','', 'n','','Y'),
('Payment_Cycle_Header_Payment_Type_Submit','Payment_Cycle_Header_Record','APPYTRHCLPRC',1,'ERRMSG','ERRMSG','string','string','50',10,'out','', 'n','','Y');

-- =======================================================
-- INSERT: Payment_Cycle_Detail_Record
-- =======================================================
INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  ISAPICALL, APIEDPOINT, STATUS
) VALUES
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'Environment','ENVID','string','string','4',1,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'UsrID','UsrID','string','string','2',2,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'Company','COMPID','string','string','2',3,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'NXTSEQ','Sequence Number','string','string','5',4,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'BKGL','BANK GL NUMBER','string','string','8',5,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'NXCK','NEXT CHECK NUMBER','string','string','6',6,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'CKDT1','CHECK DATE (MMDDYY)','date','string','6',7,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'DATE1','DATE TO PAY BY (MMDDYY)','date','string','6',8,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'FDISC','FORCE DISCOUNT','string','string','1',9,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'VEND','VENDOR NUMBER','string','string','5',10,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'VO','VOUCHER NUMBER','string','string','5',11,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'AMT','AMOUNT','Dec','Dec','6,2',12,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'DISC','DISCOUNT AMOUNT','Dec','Dec','5,2',13,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'PORH','PAY OR HOLD','string','string','1',14,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'SNGL','SINGLE CHECK','string','string','1',15,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'MKPP','MAKE PREPAID','string','string','1',16,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'PPCK','PREPAID CHECK NO','string','string','6',17,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'PPDT','PREPAID DATE','date','string','6',18,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'MODE','(I)nsert/(U)pdate/(D)elete','string','string','1',19,'in','', 'n','','Y'),
('Payment_Cycle_Detail_Record','Payment_Cycle_Detail_Record','APPYTRDCLPRC',1,'ERRMSG','ERRMSG','string','string','50',20,'out','', 'n','','Y');

INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
)
VALUES
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ACHPAY', 'ACHPAY, N or blank for all cases', 'string', 'string', 1, 3, 'in', 'n', '', ''),
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Payment_Cycle_Check_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', ''),

('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ACHPAY', 'ACHPAY, N or blank for all cases', 'string', 'string', 1, 3, 'in', 'n', '', ''),
('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Payment_Cycle_Wire_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', ''),

('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ACHPAY', 'ACHPAY, N or blank for all cases', 'string', 'string', 1, 3, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Cash-Requirements', 'y', 'AP150BCLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', ''),

('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'ACHPAY', 'ACHPAY , y in all cases', 'string', 'string', 1, 3, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Payment_Cycle_Ach_Submit', 'AP-Nacha-ACH-Creation', 'y', 'AP150BCLPRC', 2, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', '');

INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES
-- Payment_Cycle_Check_Cash_Requirement_Submit
('Payment_Cycle_Check_Cash_Requirement_Submit', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Check_Cash_Requirement_Submit', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Check_Cash_Requirement_Submit', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 3, 'in', 'n', '', ''),
('Payment_Cycle_Check_Cash_Requirement_Submit', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 4, 'in', 'n', '', ''),
('Payment_Cycle_Check_Cash_Requirement_Submit', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 5, 'out', 'n', '', ''),

-- Payment_Cycle_Check_Cash_Print_Checks_Print (no fields provided, placeholder only)
('Payment_Cycle_Check_Cash_Print_Checks_Print', 'AP-Print-checks', '', 'AP160MGPRC', 1, '', '', '', '', 0, 0, '', '', '', ''),

-- Payment_Cycle_Check_Finalize
('Payment_Cycle_Check_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Check_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Check_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 3, 'in', 'n', '', ''),
('Payment_Cycle_Check_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 4, 'in', 'n', '', ''),
('Payment_Cycle_Check_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 5, 'out', 'n', '', ''),

-- Payment_Cycle_Arch_And_Wire_Finalize (AP-Check-Printing seq 1)
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 3, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 4, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Printing', '', 'AP160CLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 5, 'out', 'n', '', ''),

-- Payment_Cycle_Arch_And_Wire_Finalize (AP-Check-Register-Report seq 2)
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 2, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 2, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 2, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 3, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 2, 'Path', 'PATH', 'string', 'string', 100, 4, 'in', 'n', '', ''),
('Payment_Cycle_Arch_And_Wire_Finalize', 'AP-Check-Register-Report', '', 'AP250CLPRC', 2, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 5, 'out', 'n', '', '');

INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES
-- Ap-monthly-Audit-Report
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Environment', 'ENVID', 'string', 'string', 1, 1, 'in', 'n', '', ''),
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Date1', 'DATE1', 'date', 'string', 6, 3, 'in', 'n', '', ''),
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Ap-monthly-Audit-Report', 'A/P Monthly Audit Report', 'Y', 'AP360PRC', 1, 'Error_Msg', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', ''),

-- Purchase_Journal
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'UsrID', 'USRID', 'string', 'string', 10, 3, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'USER', 'USER', 'string', 'string', 2, 4, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'JRDT', 'Journal Date', 'date', 'Dec', 6, 5, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'CDDATE', 'Cash Disbursement Date', 'date', 'Dec', 6, 6, 'out', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'JRID', 'Journal ID', 'string', 'string', 4, 7, 'in', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'Path', 'PATH', 'string', 'string', 100, 8, 'out', 'n', '', ''),
('Purchase_Journal', 'Purchase_Journal', '', 'AP200PRC', 1, 'Error_Msg', 'ERRMSG', 'string', 'string', 50, 9, 'out', 'n', '', '');

INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 1, 1, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 3, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'CURLST', 'Payment for report year(''C'')', 'string', 'string', 1, 4, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'FRMTYP', 'FormType', 'string', 'string', 1, 5, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Year', 'Year', 'string', 'string', 4, 6, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 7, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 8, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_options_Submit', 'AP-Vendor-1099-Register', '', 'AP760CLPRC', 1, 'Error_Msg', 'ERRMSG', 'string', 'string', 50, 9, 'out', 'n', '', '');


INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES
-- AP780CLPRC - Create 1099 File
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 1, 1, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 3, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'FRMTYP', 'FormType', 'string', 'string', 1, 4, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'Year', 'Year', 'string', 'string', 4, 5, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'ENTAMT', 'Access Amount', 'string', 'string', 8, 6, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'CURLST', 'Payment for report year(''C'')', 'string', 'string', 1, 7, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'TOTB', 'Total Balance, send default 0', 'string', 'string', 8, 8, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-Vendor-1099-Register', '', 'AP780CLPRC', 1, 'Error_Msg', 'ERRMSG', 'string', 'string', 50, 9, 'out', 'n', '', ''),

-- AP790CLPRC - File Edit
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-File-Edit', '', 'AP790CLPRC', 2, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-File-Edit', '', 'AP790CLPRC', 2, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-File-Edit', '', 'AP790CLPRC', 2, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 3, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-File-Edit', '', 'AP790CLPRC', 2, 'Path', 'PATH', 'string', 'string', 100, 4, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-File-Edit', '', 'AP790CLPRC', 2, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 5, 'out', 'n', '', ''),

-- AP795CLPRC - Print
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-print-ap', '', 'AP795CLPRC', 3, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-print-ap', '', 'AP795CLPRC', 3, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-1099-print-ap', '', 'AP795CLPRC', 3, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 3, 'out', 'n', '', ''),

-- AP791CLPRC - Printing 1099 File
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'NUM', 'Number , send last 2 digit of year as 25 for 2025', 'string', 'string', 2, 3, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 4, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'Path', 'PATH', 'string', 'string', 100, 5, 'in', 'n', '', ''),
('Year_End_1099_Process_Menu_Create_1099_File_Submit', 'AP-PRINTING-1099-FILE', '', 'AP791CLPRC', 4, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 6, 'out', 'n', '', '');


-- date  :02092025


INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES

-- AP765CLPRC - Review Files Submit
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 3, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'Head1', 'HEAD1 - Company name', 'string', 'string', 30, 4, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'Head2', 'HEAD2 - Company Address', 'string', 'string', 30, 5, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'Head3', 'HEAD3 - Company city + state + zipcode', 'string', 'string', 30, 6, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'ID', 'Federal ID', 'string', 'string', 10, 7, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'ENTAMT', 'Excess Amount', 'string', 'string', 8, 8, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'CURLST', 'Payment for report year(''C'')', 'string', 'string', 1, 9, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'FRMTYP', 'FormType', 'string', 'string', 1, 10, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'Year', 'Year', 'string', 'string', 4, 11, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Review_Files_Submit', 'AP-Vendor-create-1099-review-files', '', 'AP765CLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 12, 'out', '', '', ''),

-- AP765TPRT - Test Print
('Year_End_1099_Process_Menu_Print_Submit', 'AP-Vendor-create-1099-test-print', '', 'AP765TPRT', 1, '', '', '', '', 0, 0, '', '', '', ''),

-- AP765PRT - Print 1099
('Year_End_1099_Process_Menu_Print_Submit', 'AP-Vendor-create-1099-print', '', 'AP765PRT', 2, '', '', '', '', 0, 0, '', '', '', '');




INSERT INTO QS36FDEV.GSPINFO 
(
  MEUSECASE, MERPTNAM, ISAPICALL, MESP, MESPSEQ, MEFLDKEY, MEFLDDSC,
  MECOMPN, MEFLDTYP, MEFLL, MESEQ, METYPE, MEMETA,
  APIEDPOINT, STATUS
) VALUES
-- AP1099CLPRC - Print 1099 File Edit
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Environment', 'ENVID', 'string', 'string', 4, 1, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'UsrID', 'UsrID', 'string', 'string', 2, 2, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Company', 'COMPID', 'string', 'string', 2, 3, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Head1', 'HEAD1 - Company name', 'string', 'string', 30, 4, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Head2', 'HEAD2 - Company Address', 'string', 'string', 30, 5, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Head3', 'HEAD3 - Company city + state + zipcode', 'string', 'string', 30, 6, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'ID', 'Federal ID', 'string', 'string', 10, 7, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'FRMTYP', 'FormType', 'string', 'string', 1, 8, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Year', 'Year', 'string', 'string', 4, 9, 'in', '', '', '' ),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'ENTAMT', 'Excess Amount', 'string', 'string', 8, 10, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'CURLST', 'Payment for report year(''C'')', 'string', 'string', 1, 11, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Rpt_Name', 'REPNM', 'string', 'string', 50, 12, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'Path', 'PATH', 'string', 'string', 100, 13, 'in', '', '', ''),
('Year_End_1099_Process_Menu_Submit', 'Print-1099-File-Edit', '', 'AP1099CLPRC', 1, 'ERRMSG', 'ERRMSG', 'string', 'string', 50, 14, 'out', '', '', '');

public class InsightMail {
    
    
    public InsightMail () {
        // First, reserve email capacity for the current Apex transaction to ensure
        // that we won't exceed our daily email limits when sending email after
        // the current transaction is committed.
        Messaging.reserveSingleEmailCapacity(1);
        
        // Processes and actions involved in the Apex transaction occur next,
        // which conclude with sending a single email.
        
        // Now create a new single email message object
        // that will send out a single email to the addresses in the To, CC & BCC list.
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        
        // Strings to hold the email addresses to which you are sending the email.
        String[] toAddresses = new String[] {'rowanxmas@gmail.com'};
            //String[] ccAddresses = new String[] {'smith@gmail.com'};
            
            
            // Assign the addresses for the To and CC lists to the mail object.
            mail.setToAddresses(toAddresses);
        //mail.setCcAddresses(ccAddresses);
        
        // Specify the address used when the recipients reply to the email.
        mail.setReplyTo('rowanxmas@currentactions.com');
        
        // Specify the name used as the display name.
        mail.setSenderDisplayName('Current Actions');
        
        String insight = 'DM Campaign to Top Customers - Nov 12-23, 2001 has 1 records.';
        
        // Specify the subject line for your email address.
        mail.setSubject(insight);
        
        // Set to True if you want to BCC yourself on the email.
        mail.setBccSender(false);
        
        // Optionally append the salesforce.com email signature to the email.
        // The email address of the user executing the Apex Code will be used.
        mail.setUseSignature(true);
        
        // Specify the text content of the email.
        //mail.setPlainTextBody('Your Case: ' + case.Id +' has been created.');
        
        String pre_header = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"/><style type="text/css"> /* CLIENT-SPECIFIC STYLES */ #outlook a{padding:0;}/* Force Outlook to provide a "view in browser" message */ .ReadMsgBody{width:100%;}.ExternalClass{width:100%;}/* Force Hotmail to display emails at full width */ .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}/* Force Hotmail to display normal line spacing */ body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;}/* Prevent WebKit and Windows mobile changing default text sizes */ table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}/* Remove spacing between tables in Outlook 2007 and up */ img{-ms-interpolation-mode:bicubic;}/* Allow smoother rendering of resized image in Internet Explorer */ /* RESET STYLES */ body{margin:0; padding:0;}img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}table{border-collapse:collapse !important;}body{height:100% !important; margin:0; padding:0; width:100% !important;}/* iOS BLUE LINKS */ .appleBody a{color:#68440a; text-decoration: none;}.appleFooter a{color:#999999; text-decoration: none;}/* MOBILE STYLES */ @media screen and (max-width: 525px){/* ALLOWS FOR FLUID TABLES */ table[class="wrapper"]{width:100% !important;}/* ADJUSTS LAYOUT OF LOGO IMAGE */ td[class="logo"]{text-align: left; padding: 20px 0 20px 0 !important;}td[class="logo"] img{margin:0 auto!important;}/* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */ td[class="mobile-hide"]{display:none;}img[class="mobile-hide"]{display: none !important;}img[class="img-max"]{max-width: 100% !important; height:auto !important;}/* FULL-WIDTH TABLES */ table[class="responsive-table"]{width:100%!important;}/* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */ td[class="padding"]{padding: 10px 5% 15px 5% !important;}td[class="padding-copy"]{padding: 10px 5% 10px 5% !important; text-align: left !important;}td[class="padding-meta"]{padding: 30px 5% 0px 5% !important; text-align: center;}td[class="no-pad"]{padding: 0 0 20px 0 !important;}td[class="no-padding"]{padding: 0 !important;}td[class="section-padding"]{padding: 10px 15px 10px 15px !important;}td[class="section-padding-bottom-image"]{padding: 50px 15px 0 15px !important;}/* ADJUST BUTTONS ON MOBILE */ td[class="mobile-wrapper"]{padding: 10px 5% 15px 5% !important;}table[class="mobile-button-container"]{margin:0 auto; width:100% !important;}a[class="mobile-button"]{width:90% !important; padding: 15px !important; border: 0 !important; font-size: 16px !important;}}</style><body style="margin: 0; padding: 0;">';
        
        String hidden_text_content = 'There 3 important things for you to see today.';
        String hidden_text =  '<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> '+hidden_text_content+' </div>';
        
        // setHtmlBody(htmlBody)
        
        
        String content = pre_header;
        content = content + hidden_text;
        content = content + getTitleDateDetailsSection(insight, Date.today().format(), 'these are the details');
        content = content + getImageSection('https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Composition_of_38th_Parliament.png/220px-Composition_of_38th_Parliament.png');
        
        String[] headers = new List <String> {'One', 'Two', 'Three', 'Four', 'Five'};
            
            String[] row = new List <String> {'One', 'Two', 'Three', 'Four', 'Five'};
                 List <List<String>>  rows = new List <List<String>> {row.clone(), row.clone(), row.clone()};
                    
                    content = content + getDataTable(headers, rows);
        
        content = content + getPost('Hi');
        content = content + getFooter('botttoms up');
        
        content = content.trim() + content.trim() + content.trim() + content.trim() + content.trim() + content.trim() +content.trim() + content.trim() + content.trim() +content.trim() + content.trim() + content.trim();
        
        System.debug(content);
        
        
        // Send the email you have created.
        //Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        
    }
    
    
    public String getTitleDateDetailsSection (String title, String timestamp, String details) {
        String content = '<!-- TITLE, DATE, DETAILS --><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 15px 15px 15px 15px;" class="section-padding"> <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="left" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #808080; padding-top: 0px;font-weight:bold;" class="padding-copy">'+title+'</td></tr><tr> <td align="left" style="padding: 0px 0 0 0; font-size: 12px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #9D9D9D;" class="padding-copy">'+timestamp+' </td></tr><tr> <td align="left" style="padding: 10px 0 20px 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333;" class="padding-copy">'+details+' </td></tr></table> </td></tr></table> </td></tr></table>';
        return content;
    }
    
    public String getImageSection (String imageURL) {
        String content = '<!-- IMAGE --><table border="0" cellpadding="0" cellspacing="0" width="100%"> <td bgcolor="#ffffff" align="center" style="padding: 15px 15px 15px 15px;" class="section-padding"> <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> <tr> <td bgcolor="white" width="100" align="center"> <a href="#" target="_blank"><img alt="Logo" src="'+imageURL+'" max-width="100%" max-height="100%" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #666666; font-size: 16px;" border="0"></a> </td></tr></table> </td></table>';
        return content;
    }
    
    public String getPost (String post) {
        String content = '<!-- SMALL PRINT --><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 15px 15px 15px 15px;" class="section-padding"> <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td align="left" style="padding: 0 0 0 0; font-size: 14px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color: #aaaaaa; font-style: italic;" class="padding-copy">'+post+'</td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table>';
        return content;
    }
    
    public String getFooter (String top_line) {
        String content = '<table border="0" cellspacing="0" cellpadding="0" width="100%" align="center"> <tr> <td style="padding: 50px 0px 20px 0px;" align="center"> <table width="500" border="0" cellspacing="0" cellpadding="0" align="center" class="responsive-table"> <tr> <td align="center" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;"> <span class="appleFooter" style="color:#666666;">'+top_line+'</span> <br><a class="original-only" style="color: #666666; text-decoration: none;">Unsubscribe</a><span class="original-only" style="font-family: Arial, sans-serif; font-size: 12px; color: #444444;">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span> <a style="color: #666666; text-decoration: none;">View this email in your browser</a> </td></tr></table> </td></tr></table>';
        return content;
    }
    
    public String getDataTable (List<String> headers, List<List<String>> rows) {
        String start = '<!-- DATA TABLE CONTAINER --><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#ffffff" align="center" style="padding: 15px 15px 15px 15px;" class="section-padding"><!-- DATA TABLE --><table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table">';
        
        String header = getHeader(headers);
        String content = getTableRows(rows);
        
        String last = '</table><!-- END DATA TABLE --></td></tr></table>';
        
        return start+header+content+last;
        
    }
    
    public String getTableRows (List<List<String>> rows) {
        
        String content = '';
        
        for (String [] row : rows) {
            content = content + getRow(row);
        }
        
        return content;
    }
    
     public String getRow(String [] cells) {
        
        String start = '<tr> <td style="padding: 10px 0 0px 0;"> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td valign="top" class="mobile-wrapper">';
        
        String content = start;
        Boolean isFirst = TRUE;
        for (String cell : cells) {
            content = content + getCell(cell, isFirst, Math.round(100/cells.size()));
            if (isFirst) {
                isFirst = FALSE;
            }
        }
        
        String last = '</td></tr></table></td></tr>';
        
        return content + last;
        
    }
    
    public String getCell (String body, Boolean isFirst, Integer width) {
        
        
        String align = 'right';
        if (isFirst) {
            align = 'left';
        }
        
        System.debug('body: '+body+' align: '+align+' width: '+width);


        return '<!-- CELL --> <table cellpadding="0" cellspacing="0" border="0" width="'+width+'%" style="width: '+width+'%;" align="'+align+'"> <tr> <td style="padding: 0 0 10px 0;"> <table cellpadding="0" cellspacing="0" border="0" width="100%"> <tr> <td align="left" style="font-family: Arial, sans-serif; color: #333333; font-size: 16px;">'+body+'</td></tr></table> </td></tr></table>';
    }
    
    
    public String getHeader(String [] cells) {
        
        String start = '<tr> <td style="padding: 10px 0 0px 0; border-top: 1px solid #eaeaea; border-bottom: 1px dashed #aaaaaa;"> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td valign="top" class="mobile-wrapper">';
        
        String content = start;
        Boolean isFirst = TRUE;
        for (String cell : cells) {
            content = content + getHeaderCell(cell, isFirst, Math.round(100/cells.size()));
            if (isFirst) {
                isFirst = FALSE;
            }
        }
        
        String last = '</td></tr></table></td></tr>';
        
        return content + last;
        
    }
    
    public String getHeaderCell (String body, Boolean isFirst, Integer width) {
        
        
        String align = 'right';
        if (isFirst) {
            align = 'left';
        }
        
        System.debug('body: '+body+' align: '+align+' width: '+width);


        return '<!-- CELL --> <table cellpadding="0" cellspacing="0" border="0" width="'+width+'%" style="width: '+width+'%;" align="'+align+'"> <tr> <td style="padding: 0 0 10px 0;"> <table cellpadding="0" cellspacing="0" border="0" width="100%"> <tr> <td align="left" style="font-family: Arial, sans-serif; color: red; font-size: 16px; font-weight: bold;">'+body+'</td></tr></table> </td></tr></table>';
    }
    
    
}
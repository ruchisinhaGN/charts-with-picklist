public class AccountController {



 @AuraEnabled(cacheable=true)
 public static List<DataSet> getAllcaserecord() 
    {
      
        Schema.DescribeFieldResult fieldResult = case.status.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        decimal j=0.0;
        List<Dataset> dataset=new List<dataset>();
      
        id caseidd='500Bl000000AcniIAC';
        list<Case_Time_Tracking__c> fg=[select id,TimeInMinute__c,case__r.CaseNumber,current_case_status_value__c from Case_Time_Tracking__c where case__c =:caseidd];
        
        for(Schema.PicklistEntry s1:ple)
        {
            for(Case_Time_Tracking__c casetime:fg)
            {
                if(s1.getLabel() == casetime.current_case_status_value__c && casetime.TimeInMinute__c!=null) 
                {
                    j+=casetime.TimeInMinute__c;
                }
            }
            String Tm=s1.getLabel();
            decimal kw=j;
          
         
            Integer integerValue = kw.intValue();
            dataSet.add(new DataSet(Tm ,integerValue));
          
            j=0.0;
        }
      
        return dataset;
    }
    public class DataSet{
        public DataSet(String label ,decimal count){
            this.label  = label ; 
            this.count = count ;
        }
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public decimal count {get;set;}
        
        
    }


}
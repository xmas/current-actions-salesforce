<aura:application >
<ltng:require styles="/resource/SLDS0122/assets/styles/salesforce-lightning-design-system-ltng.css" />


<div class="slds" style="background:#EAEDF4">


<div class="slds-grid" id="header-wrap" >
        <nav class="slds-col slds-size--1-of-1">
        <c:InsightListHeader />
        </nav>
        </div>
	<div class="slds-grid slds-p-right--medium lds-p-left--medium slds-p-top--medium slds-p-bottom--medium" id ="container">

		<div class="slds-col" id="left">
			<c:InsightNav />
		</div>
		<div class="slds-col" id="right">
			<c:InsightList />
			<!-- <c:Accordian /> -->

		</div>


	</div>
</div>



</aura:application>
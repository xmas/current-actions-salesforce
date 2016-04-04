<aura:application >
<ltng:require styles="/resource/SLDS0122/assets/styles/salesforce-lightning-design-system-ltng.css" />


<div class="slds" style="background:white">


<div class="slds-grid" id="header-wrap" >
        <nav class="slds-col slds-size--1-of-1">
        <c:InsightListHeader />
        </nav>
        </div>
	<div class="slds-grid" id ="container">

		<div class="slds-col" id="left">
			<c:InsightList />
		</div>
		<div class="slds-col slds-p-around--small left-border" id="right">
			<c:InsightDetail />
		</div>


	</div>
</div>



</aura:application>
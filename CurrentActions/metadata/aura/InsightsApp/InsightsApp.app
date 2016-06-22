<aura:application >
<ltng:require styles="/resource/SLDS100/assets/styles/salesforce-lightning-design-system-ltng.css,/resource/rezza_fonts_css,/resource/Semantic/semantic.min.css" scripts="/resource/jq3,/resource/underscore,/resource/plotly,/resource/moment,/resource/Semantic/semantic.min.js" afterScriptsLoaded="{!c.postScript}"/>


<div class="slds" style="background:white">


<div class="slds-grid" id="header-wrap" >
        <nav class="slds-col slds-size--1-of-1">
        <c:InsightListHeader />
        </nav>
        </div>
	<div class="slds-grid" id ="container">

		<div class="slds-col right-border" id="left">
			<c:InsightList />
		</div>
		<div class="slds-col " id="right">
			<c:InsightDetail />
		</div>


	</div>
</div>



</aura:application>
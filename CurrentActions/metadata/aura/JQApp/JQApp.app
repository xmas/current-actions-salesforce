<aura:application>

    <aura:handler name="init" value="{!this}" action="{!c.doInit}"/>
    <aura:attribute name="type" type="String" default="News" description="The type of feed" access="GLOBAL"/>
    <aura:attribute name="types" type="String[]"
                    default="Bookmarks,Company,Files,Groups,Home,News,People"
                    description="A list of feed types"/>
   <h1>My Feeds</h1>
   <ui:inputSelect aura:id="typeSelect" change="{!c.onChangeType}" label="Type"/>
    <div aura:id="feedContainer" class="feed-container">
        <forceChatter:fullFeed />
    </div>

</aura:application>
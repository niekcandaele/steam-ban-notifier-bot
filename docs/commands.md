---
layout: page
title: Commands
permalink: /commands/
---

<div style="text-align: center">

<h1 class="page-title">{{ page.title | escape }}</h1>

<div class="row">
    <div class="col s12">

      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Track</span>
          <p>Start tracking a account</p>
        </div>
        <div class="card-action">
        <a>track "steam id" </a>
        </div>
      </div>

            <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Remove</span>
          <p>Stop tracking a account. If used in a DM, it removes the account from your personal tracked list. If used in a guild channel, it removes from the guild tracked list</p>
        </div>
        <div class="card-action">
        <a>remove "steam id" </a>
        </div>
      </div>

            <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Notificationchannel</span>
          <p>Configure the channel to send notifications in this guild.</p>
        </div>
        <div class="card-action">
        <a>notificationchannel #banned-accounts</a>
        </div>
      </div>

                  <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">List</span>
          <p>List the accounts being tracked right now. If used in a DM, it shows your personal tracked accounts. If used in a guild channel, it shows accounts tracked by the guild</p>
        </div>
        <div class="card-action">
        <a>list</a>
        </div>
      </div>
      
    </div>
  </div>

</div>
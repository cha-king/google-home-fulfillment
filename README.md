# google-home-fulfillment
Local webhook for integrating Google Home with home services/devices


## To-Do
- Handle auth
    - No need to handle user auth so long as app is in test mode
    - We should authenticate google with client id / secret though
    - Issue JWT to check on incoming requests
- Remove any stupid stubbed out descriptors
- Implement local fulfillment
- Handle report state
    - Probably stupid if the light doesn't have another means to set it
- Maybe some sort of service discovery, since .local doesn't work nicely with docker

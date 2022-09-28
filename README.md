# ONLINE IGO

## HOW TO RUN

### Environment Variables

```
IGO_PORT="PORT"
```

### nginx Settings

#### WebSocket

```
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    # SOMETHING
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    # SOMETHING
}
```


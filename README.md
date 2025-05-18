# DDL

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : has
    USER ||--|| BALANCE : has
    SERVICE ||--o{ TRANSACTION : used_in
    
    USER {
        uuid id PK
        varchar email
        varchar first_name
        varchar last_name
        text password
        text profile_image
        timestamp created_at
        timestamp updated_at
    }
    
    BANNER {
        uuid id PK
        varchar banner_name
        text banner_image
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    SERVICE {
        uuid id PK
        varchar service_code
        text service_name
        text service_icon
        integer service_tariff
        timestamp created_at
        timestamp updated_at
    }
    
    BALANCE {
        uuid id PK
        uuid user_id FK
        integer balance
        timestamp updated_at
    }
    
    TRANSACTION {
        uuid id PK
        uuid user_id FK
        uuid service_id FK
        varchar invoice_number
        decimal total_amount
        varchar transaction_type
        timestamp created_at
        timestamp updated_at
    }
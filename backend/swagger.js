const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Events Bari',
      version: '1.0.0',
      description: 'Documentazione delle API backend per web app Events Bari',
    }, 
    servers: [
      {
        url: 'http://localhost:4000', 
        description: 'Server di sviluppo',
      },
    ],

    tags : [
        {name: "userController", description: "Registrazione utenti e autenticazione"},
        {name: "eventController", description: "Gestione eventi, permessi e partecipazione" },
        {name: "messageController", description: "Chat di gruppo per eventi e chat privata" },
    ], 
    components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Inserisci il token JWT dato al login",
                },
            },
            
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665a1b2c3d4e5f6789012345" },
                        username: { type: "string", example: "mario_rossi" },
                        email: { type: "string", format: "email", example: "mario@email.com" },
                        profilePic: { type: "string", example: "" },
                    },
                },
              Event: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665a1b2c3d4e5f6789012345" },
                        title: { type: "string", example: "Evento musicale live" }, 
                        date: { type: "string", format: "date", example: "2024-11-15" },
                        time: { type: "string", example: "21:30" }, 
                        location: { type: "string", example: "Parco 2 Giugno" }, 
                        mapsUrl: { type: "string", example: "https://maps.google.com/?q=Parco+2+Giugno" }, 
                        description: { type: "string", example: "Evento musicale al parco con cantanti/band emergenti" }, 
                        maxParticipants: { type: "integer", example: 100 }, 
                        user_id: { type: "string", description: "ID del creatore (o oggetto popolato)" }, 
                        interestedUsers: {
                            type: "array",
                            items: { type: "string" },
                            description: "Array di ID utente o oggetti utente popolati" 
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Message: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "665a1b2c3d4e5f6789012345" },
                        senderId: { type: "string", description: "ID del mittente (o oggetto popolato)" },
                        reciverId: { type: "string", nullable: true, example: "665a1b2c3d4e5f6789012346" },
                        eventId: { type: "string", nullable: true, example: null },
                        text: { type: "string", example: "Ciao, a che ora ci vediamo?" },
                        image: { type: "string", example: "" },
                        video: { type: "string", example: "" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                SignupRequest: {
                    type: "object",
                    required: ["email", "username", "password", "confirmPassword"],
                    properties: {
                        email: { type: "string", format: "email", example: "mario@email.com" },
                        username: { type: "string", maxLength: 20, example: "mario_rossi" },
                        password: { type: "string", description: "Min 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero, 1 carattere speciale", example: "Password123!" },
                        confirmPassword: { type: "string", example: "Password123!" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    description: "Accetta sia email che username come identificatore",
                    properties: {
                        email: { type: "string", example: "mario@email.com" },
                        username: { type: "string", example: "mario_rossi" },
                        password: { type: "string", example: "Password123!" },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        token: { type: "string" },
                    },
                },
                EventRequest: {
                    type: "object",
                    required: ["title", "date", "time", "location", "maxParticipants"],
                    properties: {
                        title: { type: "string", example: "Midnight Chords live al pub" },
                        date: { type: "string", format: "date", example: "2024-12-05" },
                        time: { type: "string", example: "22:00" },
                        location: { type: "string", example: "Pub in centro" },
                        mapsUrl: { type: "string", example: "https://goo.gl/maps/..." },
                        description: { type: "string", example: "Presentazione dei pezzi della band" },
                        maxParticipants: { type: "integer", minimum: 1, example: 50 },
                    },
                },
                MessageRequest: {
                    type: "object",
                    properties: {
                        reciverId: { type: "string", description: "ID destinatario per chat privata" },
                        eventId: { type: "string", description: "ID evento per chat di gruppo" },
                        text: { type: "string", example: "Tutto confermato per domani?" },
                        image: { type: "string" },
                        video: { type: "string" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: { type: "string", example: "Messaggio di errore" },
                        emptyFields: { type: "array", items: { type: "string" } },
                    },
                },
            },
        },

        paths: {

            // USERS
            "/api/users/signup": {
                post: {
                    tags: ["Users"],
                    summary: "Registrazione nuovo utente",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/SignupRequest" } } },
                    },
                    responses: {
                        200: { description: "Utente creato e autenticato", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
                        400: { description: "Errore di validazione (campi mancanti, password debole o mismatch, email/username in uso)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/users/login": {
                post: {
                    tags: ["Users"],
                    summary: "Login utente",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
                    },
                    responses: {
                        200: { description: "Login effettuato con successo", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
                        400: { description: "Credenziali errate o campi mancanti", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/users/": {
                get: {
                    tags: ["Users"],
                    summary: "Ottieni la lista di tutti gli utenti",
                    description: "Recupera tutti gli utenti eccetto quello attualmente autenticato (utile per iniziare nuove chat).",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Lista utenti", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
                        400: { description: "Errore del server" },
                        401: {description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }}
                    },
                },
            },

            // EVENTS 
            "/api/events/": {
                get: {
                    tags: ["Events"],
                    summary: "Elenco degli eventi",
                    description: "Recupera gli eventi dalla data di ieri in poi, ordinati per i più recenti.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Array di eventi", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Event" } } } } },
                    },
                    
                    401: { 
                        description: "Non autorizzato (Token mancante o invalido)", 
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
                        },
                    },

                    post: {
                        tags: ["Events"],
                        summary: "Crea un nuovo evento",
                        security: [{ bearerAuth: [] }],
                        requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/EventRequest" } } },
                    },

                    responses: {
                        200: { description: "Evento creato con successo", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
                        400: { description: "Campi mancanti o data nel passato", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            "/api/events/{id}": {
                get: {
                    tags: ["Events"],
                    summary: "Dettagli singolo evento",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: {
                        200: { description: "Dettaglio evento", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        404: { description: "Evento non trovato o ID non valido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                patch: {
                    tags: ["Events"],
                    summary: "Modifica evento",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { type: "object", description: "Campi da aggiornare" } } },
                    },
                    responses: {
                        200: { description: "Evento aggiornato", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
                        400: { description: "Evento non trovato" },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        404: { description: "ID non valido" },
                    },
                },
                delete: {
                    tags: ["Events"],
                    summary: "Elimina evento",
                    description: "Solo l'utente che ha creato l'evento può eliminarlo.",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: {
                        200: { description: "Evento eliminato" },
                        400: { description: "Evento non trovato" },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        403: { description: "Non hai i permessi per eliminare questo evento", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        404: { description: "ID non valido" },
                    },
                },
            },
            "/api/events/{id}/interest": {
                patch: {
                    tags: ["Events"],
                    summary: "Alterna stato di interesse",
                    description: "Aggiuge un utente ad un evento di suo interesse o lo rimuove se ne fa già parte. Controlla che i posti non siano esauriti.",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: {
                        200: { description: "Stato aggiornato e utente aggiunto all'evento", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
                        400: { description: "Posti esauriti per questo evento", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        404: { description: "Evento non trovato" },
                    },
                },
            },

            // MESSAGES 
            "/api/messages/": {
                post: {
                    tags: ["Messages"],
                    summary: "Invia un messaggio",
                    description: "Invia un messaggio per una chat privata o di gruppo .",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/MessageRequest" } } },
                    },
                    responses: {
                        200: { description: "Messaggio inviato ", content: { "application/json": { schema: { $ref: "#/components/schemas/Message" } } } },
                        400: { description: "Errore nell'invio" },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/messages/event/{eventId}": {
                get: {
                    tags: ["Messages"],
                    summary: "Recupera messaggi della chat evento",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string" } }],
                    responses: {
                        200: { description: "Cronologia chat di gruppo", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Message" } } } } },
                        400: { description: "Errore" },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },

                    },
                },
            },
            "/api/messages/private/{userId}": {
                get: {
                    tags: ["Messages"],
                    summary: "Recupera messaggi privati",
                    description: "Recupera la conversazione privata con un altro utente.",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
                    responses: {
                        200: { description: "Cronologia chat privata", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Message" } } } } },
                        400: { description: "Errore" },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/messages/conversations": {
                get: {
                    tags: ["Messages"],
                    summary: "Recupera conversazioni attive",
                    description: "Estrae la lista degli utenti con cui il richiedente ha una chat privata aperta.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Lista utenti (esclusa password)", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
                        401: { description: "Non autorizzato (Token mancante o invalido)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        500: { description: "Errore nel recupero delle conversazioni" },
                    },
                },
            },
        },
    },

    apis:[],

};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpec; 
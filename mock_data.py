from models import db, Conversation, Message

mock_conversations = [
    {
        "messages": [
            {"sender": "agent", "text": "Hi Alex! Welcome to VoiceUp Support. How can I help you?"},
            {"sender": "customer", "text": "My internet keeps disconnecting and it's really frustrating!"},
            {"sender": "agent", "text": "I'm so sorry for the inconvenience, Alex. Let me check this for you."},
            {"sender": "customer", "text": "Thanks, I hope it gets fixed soon."},
            {"sender": "agent", "text": "I have reset your connection. Could you please check now?"},
            {"sender": "customer", "text": "Yes, it's working now. Thank you!"}
        ]
    },
    {
        "messages": [
            {"sender": "agent", "text": "Hello, how can I assist you today?"},
            {"sender": "customer", "text": "My router is showing a red light and no internet."},
            {"sender": "agent", "text": "No worries, our routers usually fix themselves in a few minutes."},
            {"sender": "customer", "text": "Are you sure? This has been happening for an hour."},
            {"sender": "agent", "text": "Guaranteed it will be fine soon!"}
        ]
    },
    {
        "messages": [
            {"sender": "agent", "text": "Hello, please tell me what the problem is"},
            {"sender": "customer", "text": "I have been trying to call you for an hour now"},
            {"sender": "agent", "text": "My apologies. This usually never happens"},
            {"sender": "customer", "text": "Are you sure? It is an emergency and this is how long you make me wait?"},
            {"sender": "agent", "text": "As I said sir, we are very sorry. What can I do to solve your issue?"},
            {"sender": "customer", "text": "Never mind now, I am done with your service"}
        ]
    }
]

def seed_mock_data():
    if Conversation.query.count() > 0:
        print("Mock data already exists — skipping seeding.")
        return

    print("Seeding mock data...")
    for convo in mock_conversations:
        conversation = Conversation()
        db.session.add(conversation)
        db.session.flush()  # assigns ID

        for msg in convo['messages']:
            message = Message(
                conversation_id=conversation.id,
                sender=msg['sender'],
                text=msg['text']
            )
            db.session.add(message)
    db.session.commit()
    print("Done seeding.")

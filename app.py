from flask import Flask, jsonify, request
from flask_cors import CORS
from config import DATABASE_URI
from db import db
from models import Conversation, Message, AnalysisResult
from mock_data import seed_mock_data
from utils.emotion import detect_emotion
from utils.compliance import check_compliance

from models import AnalysisResult


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)



# Get all conversations
@app.route('/api/conversations', methods=['GET'])
def get_conversations():
    conversations = Conversation.query.all()
    data = []
    for convo in conversations:
        messages = Message.query.filter_by(conversation_id=convo.id).all()
        data.append({
            "conversation_id": convo.id,
            "messages": [{"sender": m.sender, "text": m.text} for m in messages]
        })
    return jsonify(data)

# Analyzing a conversation (Emotion + Compliance)
@app.route('/api/analyze/<int:conversation_id>', methods=['POST'])
def analyze_conversation(conversation_id):
    messages = Message.query.filter_by(conversation_id=conversation_id).all()
    if not messages:
        return jsonify({"error": "Conversation not found"}), 404

    # Emotion Analysis
    emotion_summary = []
    for m in messages:
        emotion = detect_emotion(m.text) if m.sender == 'customer' else None
        emotion_summary.append({
            "id": m.id,
            "sender": m.sender,
            "text": m.text,
            "emotion": emotion
        })

    # Compliance Checking
    msg_list = [{"sender": m.sender, "text": m.text} for m in messages]
    compliance_result = check_compliance(msg_list)

    # Save analysis results to Database
    result = AnalysisResult(
        conversation_id=conversation_id,
        emotion_summary=emotion_summary,
        compliance_summary=compliance_result['violations'],
        overall_compliance_score=compliance_result['score']
    )
    db.session.add(result)
    db.session.commit()

    return jsonify({
        "emotion_summary": emotion_summary,
        "compliance_summary": compliance_result['violations'],
        "score": compliance_result['score']
    })



@app.route('/api/analytics-summary', methods=['GET'])
def get_analytics_summary():
    results = AnalysisResult.query.all()
    total = len(results)

    if total == 0:
        return jsonify({"error": "No analysis results found"}), 404

    compliant = sum(1 for r in results if r.overall_compliance_score == 100)
    non_compliant = total - compliant

    # Counting emotions
    emotion_counts = {"happy": 0, "angry": 0, "neutral": 0}
    for r in results:
        for msg in r.emotion_summary:
            if msg["sender"] == "customer" and msg["emotion"]:
                emotion_counts[msg["emotion"]] += 1

    # Violation frequencies
    from collections import Counter
    all_violations = []
    for r in results:
        all_violations.extend(r.compliance_summary)

    violations_count = dict(Counter(all_violations))

    return jsonify({
        "compliance": {
            "compliant": compliant,
            "non_compliant": non_compliant
        },
        "emotions": emotion_counts,
        "violations": violations_count
    })

@app.route('/api/reset-analysis', methods=['POST'])
def reset_analysis():
    try:
        deleted = AnalysisResult.query.delete()
        db.session.commit()
        return jsonify({"message": f"Deleted {deleted} analysis records"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500






if __name__ == "__main__":
    with app.app_context():
        
        db.create_all()         
        seed_mock_data()        
    app.run(debug=True)



import re

RULES = {
    1: lambda m: re.search(r'\b(hi|hello|welcome)\b', m.lower()),

    2: lambda m, context: (
        any(re.search(r'(frustrating|angry|annoyed)', c.lower()) for c in context['customer']) and
        'sorry' in m.lower()
    ),

    3: lambda m: re.search(r'(issue.*resolved|is it working now|confirm.*fix)', m.lower()),

    4: lambda m: re.search(r'(guaranteed uptime|fix it forever)', m.lower()),

    5: lambda m, context: any(name in m for name in context['customer_names'])
}

def check_compliance(messages):
    violations = []
    context = {
        "customer": [m['text'] for m in messages if m['sender'] == 'customer'],
        "customer_names": extract_customer_names(messages)
    }

    for rule_num, rule_fn in RULES.items():
        rule_applied = False
        for m in messages:
            if m['sender'] == 'agent':
                try:
                    rule_applied = rule_fn(m['text'], context) if rule_fn.__code__.co_argcount == 2 else rule_fn(m['text'])
                except:
                    continue
            if rule_applied:
                break
        if not rule_applied:
            violations.append(f"Rule {rule_num} violated")

    score = 100 - len(violations) * 20
    return {"violations": violations, "score": max(score, 0)}

def extract_customer_names(messages):
    # naive name extraction from greetings like "Hi Alex"
    names = []
    for m in messages:
        if m['sender'] == 'agent':
            match = re.search(r'\bhi (\w+)', m['text'].lower())
            if match:
                names.append(match.group(1).capitalize())
    return names

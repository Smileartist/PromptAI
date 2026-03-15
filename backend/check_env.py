with open('.env', 'r') as f:
    content = f.read()
print(f'Total length: {len(content)}')
# Check how many actual newlines
lines = content.split('\n')
print(f'Line count: {len(lines)}')
for i, line in enumerate(lines):
    if line.startswith('OPENAI') or line.startswith('JWT') or line.startswith('PORT') or line.startswith('FIREBASE'):
        print(f'Line {i}: {line[:80]}...')

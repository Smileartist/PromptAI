from marshmallow import Schema, fields, validate, ValidationError

ALLOWED_CATEGORIES = [
    "Coding", "Writing", "Marketing", "Design", 
    "Research", "Productivity", "General"
]

class GeneratePromptRequestSchema(Schema):
    idea = fields.String(
        required=True, 
        validate=validate.Length(min=1, max=1000),
        error_messages={"required": "Idea is required", "invalid": "Idea must be a string"}
    )

class PromptResponseSchema(Schema):
    id = fields.Integer()
    user_input = fields.String()
    generated_prompt = fields.String()
    category = fields.String()
    created_at = fields.DateTime()

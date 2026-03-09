# Data Shape

## Entities

### Employee
A person within the organization. Holds profile information, role, department assignment, and employment status. Serves as the central identity across all modules.

### Department
An organizational unit that groups employees. Used for scoping assignments, filtering analytics, and structuring the org hierarchy.

### Role
A job title or function within the organization. Assigned to employees and used for permission scoping and training requirements.

### Training
A structured learning program created by admins. Contains an ordered sequence of slides, a rules page, a quiz, and configuration for recurrence and assignment.

**Access configuration:**
- password_protected (boolean)
- access_password (string, nullable)
- shareable_link_token (string, unique, nullable)
- link_visibility (enum: private, link-only, public)

**Rules page configuration:**
- rules_page_title (string)
- rules_page_description (text)
- rules_custom_instructions (text, nullable)
- allow_pause (boolean)
- must_complete_in_one_sitting (boolean)
- exit_behavior (enum: abandon, fail, flag)
- lock_quiz_until_slides_complete (boolean)
- require_minimum_video_watch (boolean)
- show_estimated_duration_on_rules (boolean)
- show_passing_score_on_rules (boolean)
- show_question_count_on_rules (boolean)

### Slide
A single content unit within a training. Can be a video, a text block, or an inline question. Ordered sequentially within its parent training.

### Question
A quiz or inline question with answer options and a correct answer. Can belong to a specific training's quiz, an inline slide, or a shared question bank. Supports bulk import via CSV.

### QuestionBank
A reusable pool of questions organized by topic. Admins can pull questions from banks into any training quiz.

### Attempt
A single instance of an employee taking a training. Tracks start time, completion time, slide-level timing and behavior, quiz score, and pass/fail status.

### AttemptAnswer
A single answer submitted by an employee for a specific question during an attempt. References the attempt and question, stores the selected option(s), whether the answer was correct, and time spent in seconds.

### Assignment
A record linking an employee to a training they must complete. Tracks due date, completion status, and recurrence configuration.

## Relationships

- Department has many Employee
- Role has many Employee
- Employee belongs to Department
- Employee belongs to Role
- Training has many Slide
- Training has many Question
- Training has many Assignment
- Training has many Attempt
- QuestionBank has many Question
- Question belongs to Training or QuestionBank
- Assignment belongs to Training
- Assignment belongs to Employee
- Attempt belongs to Training
- Attempt belongs to Employee
- Attempt has many AttemptAnswer
- AttemptAnswer belongs to Attempt
- AttemptAnswer belongs to Question

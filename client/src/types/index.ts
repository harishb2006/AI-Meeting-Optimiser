export interface Task {
  task: string;
  assignee?: string;
  deadline?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Decision {
  decision: string;
  rationale?: string;
}

export interface AnalysisResult {
  meeting_title: string;
  summary: string;
  tasks: Task[];
  decisions: Decision[];
  follow_ups?: string[];
}

export interface TranscriptRequest {
  transcript: string;
  meeting_title: string;
}

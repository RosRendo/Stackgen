import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class ModelField {
  @IsOptional()
  @IsString()
  model?: string;
}

export class GenerateBlueprintDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  level: string;
}

export class GenerateTaskPromptDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  taskTitle: string;

  @IsOptional()
  @IsString()
  taskDescription?: string;

  @IsArray()
  techStack: any[]; // we'll pass the full techStack items to group them

  @IsOptional()
  @IsArray()
  checklist?: any[];

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  projectDescription?: string;
}

export class ChatDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  context?: any;
}

export class GenerateDocsDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  techStack: any[];

  @IsArray()
  nodes: any[];
}

export class GenerateGuideDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  techStack: any[];

  @IsArray()
  checklist: any[];
}

export class ScanGithubDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  githubUrl: string;
}

export class EstimateCostDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsArray()
  techStack: any[];
}

export class GenerateZipDto extends ModelField {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsArray()
  techStack: any[];
}

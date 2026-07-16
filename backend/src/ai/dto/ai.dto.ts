import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class GenerateBlueprintDto {
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

export class GenerateTaskPromptDto {
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

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  context?: any;
}

export class GenerateDocsDto {
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

export class ScanGithubDto {
  @IsString()
  @IsNotEmpty()
  githubUrl: string;
}

export class EstimateCostDto {
  @IsString()
  @IsNotEmpty()
  level: string;

  @IsArray()
  techStack: any[];
}

export class GenerateZipDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsArray()
  techStack: any[];
}

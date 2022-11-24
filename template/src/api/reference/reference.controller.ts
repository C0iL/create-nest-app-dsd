import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ReferenceService } from './reference.service';

@ApiTags('References')
@UseGuards(JwtAuthGuard)
@Controller('reference')
export class ReferenceController {
	constructor(private readonly referenceService: ReferenceService) {}

	@ApiOperation({ summary: 'Get genres' })
	@Get('title/genres')
	async getGenres() {
		return this.referenceService.getGenres();
	}
}

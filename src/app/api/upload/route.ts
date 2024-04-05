import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server'
import chalk from 'chalk'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { r2 } from '@/lib/r2'

export async function POST(request: Request) {
	try {
		console.log(chalk.yellow(`Generating an upload URL!`))

		// Generate a unique file name
		const fileName = uuidv4() + '.pdf';

		const signedUrl = await getSignedUrl(
			r2,
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: fileName,
			}),
			{ expiresIn: 60 }
		)

		console.log(chalk.green(`Success generating upload URL!`))

		console.log(signedUrl)

		return NextResponse.json({ url: signedUrl })
	} catch (err) {
		console.log('error')
	}
}
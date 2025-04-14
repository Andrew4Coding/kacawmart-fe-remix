import { ActionFunctionArgs } from "@remix-run/node";
import { uploadFileToS3Server } from "~/lib/s3";

export async function action(args: ActionFunctionArgs) {
    try {
        const formData = await args.request.formData();

        const file = formData.get('upload');
        const url = await uploadFileToS3Server(file as File, formData.get('key') as string);

        return Response.json(
            { url: url, errors: {}, success: true },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        
        return Response.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
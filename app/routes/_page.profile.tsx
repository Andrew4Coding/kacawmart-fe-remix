// import { json, LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node"; 
// import { useLoaderData, useActionData, useNavigation, Form as RemixForm, useSubmit } from "@remix-run/react";
// import { format } from "date-fns";

// import ProfileModule from "~/modules/ProfileModule";


// interface LoaderData {
//     profileData: {
//         id: string;
//         city: string;
//         province: string;
//         postal: string;
//         gender: "L" | "P";
//         birthdate: string;
//         phone: string;
//         profileImageUrl: string;
//         isEnable2Fa: boolean;
//         lastLogin: string;
//         createdAt: string;
//         updatedAt: string;
        
//         email: string; 
//         name: string;
//     };
//     error?: string;
    
// }


// interface ActionData {
//     success?: boolean;
//     error?: string;
//     fieldErrors?: Record<string, string>; 
// }

// const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// export async function loader({ request }: LoaderFunctionArgs) {
//     const session = await getSession(request.headers.get("Cookie"));
//     const token = session.get("accessToken");

//     if (!token) {
      
//         return redirect("/login");
//     }

//     try {
//         const response = await fetch(`${BACKEND_API_URL}/api/profile`, {
//             method: "GET",
//             headers: {
//                 "Accept": "application/json",
               
//                 "Authorization": `Bearer ${token}`,
              
//             },
//         });

//         if (!response.ok) {
//             if (response.status === 401) return redirect("/login");
//             throw new Error(`Failed to fetch profile: ${response.statusText}`);
//         }

//         const profileData = await response.json();

       
//         const email = session.get("userEmail") || profileData.email; 
//         const name = session.get("userName") || profileData.name;    

     
//         return json<LoaderData>({
//              profileData: {
//                 ...profileData,
//                 email: email, 
//                 name: name,
//              }
//         });

//     } catch (error) {
//         console.error("Profile loader error:", error);
//         return json<LoaderData>({ profileData: {} as any, error: "Could not load profile data." }, { status: 500 });
//     }
// }


// export async function action({ request }: ActionFunctionArgs) {
//     const session = await getSession(request.headers.get("Cookie"));
//     const token = session.get("accessToken");

//     if (!token) {
//         return json<ActionData>({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (request.method !== "PUT") {
//          return json<ActionData>({ error: "Method Not Allowed" }, { status: 405 });
//     }

//     const formData = await request.formData();
//     const updates = Object.fromEntries(formData);

//     try {
        
//         const dateValue = updates.birthdate ? new Date(updates.birthdate as string) : undefined;
//         const isEnable2FaValue = updates.isEnable2Fa === 'on' || updates.isEnable2Fa === 'true'; // FormData sends 'on' for checkboxes

//         const validatedData = profileFormSchema.parse({
//             ...updates,
//             birthdate: dateValue,
//             isEnable2Fa: isEnable2FaValue,
//         });

     
//         const payload = {
//             ...validatedData,
//             birthdate: format(validatedData.birthdate, "yyyy-MM-dd"), 
//         };


//         const response = await fetch(`${BACKEND_API_URL}/api/profile`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//                 "Authorization": `Bearer ${token}`,
              
//             },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
          
//             let errorMsg = `Failed to update profile: ${response.statusText}`;
//             try {
//                 const errorBody = await response.json();
//                 errorMsg = errorBody.message || errorBody.error || errorMsg;
//             } catch (e) {/* Ignore parsing error */}
//             throw new Error(errorMsg);
//         }


//         return json<ActionData>(
//             { success: true },
           
          
//         );

//     } catch (error: any) {
//         console.error("Profile action error:", error);
//         if (error instanceof z.ZodError) {
        
//             const fieldErrors = error.errors.reduce((acc, curr) => {
//                 acc[curr.path[0]] = curr.message;
//                 return acc;
//             }, {} as Record<string, string>);
//             return json<ActionData>({ error: "Validation failed", fieldErrors }, { status: 400 });
//         }
//         return json<ActionData>({ error: error.message || "Failed to update profile." }, { status: 500 });
//     }
// }



// export default function ProfileRoute() {
//     const loaderData = useLoaderData<typeof loader>();
//     const actionData = useActionData<typeof action>();
//     const navigation = useNavigation();
//     const submit = useSubmit(); 

   
//     if (loaderData.error) {
//         return <div className="pt-40 text-red-600 text-center">{loaderData.error}</div>;
//     }

//     return (
//         <ProfileModule
//             initialData={loaderData.profileData}
//             actionData={actionData}
//             navigationState={navigation.state}
//             submitForm={submit} 
//         />
//     );
// }
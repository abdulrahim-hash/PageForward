import { createClient } from "@supabase/supabase-js";
import { institutions, programOfferings } from "../lib/catalog.ts";

process.loadEnvFile?.(".env.local");
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const {data:university,error:universityError}=await db.from("universities").upsert({name:"National University of Sciences and Technology",short_name:"NUST",slug:"nust",city:"Islamabad",country:"Pakistan",active:true},{onConflict:"slug"}).select("id").single();
if(universityError)throw universityError;

const campusSeeds=[...new Map(Object.values(institutions).map(i=>[i.campusSlug,{name:i.campus,slug:i.campusSlug,city:i.city}])).values()];
const campusIds=new Map<string,string>();
for(const campus of campusSeeds){const {data,error}=await db.from("campuses").upsert({university_id:university.id,...campus,active:true},{onConflict:"university_id,slug"}).select("id,slug").single();if(error)throw error;campusIds.set(data.slug,data.id);}
const institutionIds=new Map<string,string>();
for(const item of Object.values(institutions)){const {data,error}=await db.from("institutions").upsert({university_id:university.id,name:item.name,short_name:item.code,slug:item.slug,campus_id:campusIds.get(item.campusSlug),active:true},{onConflict:"university_id,slug"}).select("id,slug").single();if(error)throw error;institutionIds.set(data.slug,data.id);}
const degreeIds=new Map<string,string>();
for(const offering of programOfferings){if(degreeIds.has(offering.degreeSlug))continue;const {data,error}=await db.from("degrees").upsert({name:offering.degreeName,short_name:offering.degreeShortName,slug:offering.degreeSlug,category:offering.category,active:true},{onConflict:"slug"}).select("id,slug").single();if(error)throw error;degreeIds.set(data.slug,data.id);}
for(const [index,offering] of programOfferings.entries()){const {error}=await db.from("program_offerings").upsert({public_id:offering.id,degree_id:degreeIds.get(offering.degreeSlug),institution_id:institutionIds.get(offering.institutionSlug),campus_id:campusIds.get(offering.campusSlug),status:offering.status,launch_term:offering.launchTerm??null,official_source_url:offering.officialSourceUrl,last_verified_at:offering.lastVerifiedAt,active:true,display_order:index+1},{onConflict:"public_id"});if(error)throw error;}
const topicNames=["Academics","Curriculum","Workload","Campus life","Societies","Internships","Career options","First year","University transition","Research","Hostel life"];
for(const name of topicNames){const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,"-");const {error}=await db.from("mentor_topics").upsert({name,slug},{onConflict:"slug"});if(error)throw error;}
console.log(`Seeded NUST, ${campusSeeds.length} campuses, ${Object.keys(institutions).length} institutions, ${degreeIds.size} degrees, and ${programOfferings.length} program offerings.`);

create extension if not exists pgcrypto;

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(), name text not null, short_name text not null,
  slug text not null unique, city text, country text not null default 'Pakistan', active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  name text not null, slug text not null, city text not null, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(university_id, slug)
);
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  name text not null, short_name text not null, slug text not null, campus_id uuid references public.campuses(id), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(university_id, slug)
);
create table if not exists public.degrees (
  id uuid primary key default gen_random_uuid(), name text not null, short_name text not null, slug text not null unique,
  category text not null, description text, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.program_offerings (
  id uuid primary key default gen_random_uuid(), public_id text not null unique,
  degree_id uuid not null references public.degrees(id), institution_id uuid not null references public.institutions(id), campus_id uuid not null references public.campuses(id),
  status text not null default 'current' check (status in ('current','upcoming','archived')), launch_term text,
  official_source_url text, last_verified_at timestamptz, active boolean not null default true, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(degree_id,institution_id,campus_id)
);
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(), offering_id uuid not null references public.program_offerings(id), full_name text not null,
  slug text not null unique, email_private text not null, semester integer not null check (semester between 1 and 12), graduation_year integer not null,
  bio text not null, languages text[] not null default '{}', profile_image_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  mentor_status text not null default 'paused' check (mentor_status in ('active','paused','archived')), availability_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.mentor_topics (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique
);
create table if not exists public.mentor_topic_links (
  mentor_id uuid not null references public.mentors(id) on delete cascade, topic_id uuid not null references public.mentor_topics(id) on delete cascade,
  primary key(mentor_id,topic_id)
);
create table if not exists public.mentor_applications (
  id uuid primary key default gen_random_uuid(), full_name text not null, nust_email text not null, offering_id uuid not null references public.program_offerings(id),
  semester integer not null, graduation_year integer not null, bio text not null, reason text not null, topics text[] not null default '{}', languages text[] not null default '{}',
  availability text not null, linkedin_url text, verification_consent boolean not null default false, code_of_conduct_agreement boolean not null default false,
  verification_notes text, status text not null default 'pending' check(status in ('pending','under_review','verified','approved','rejected','paused')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.guidance_requests (
  id uuid primary key default gen_random_uuid(), student_name text not null, student_email text not null, phone_optional text,
  school_college text not null, education_level text not null, offering_id uuid not null references public.program_offerings(id),
  preferred_mentor_id uuid references public.mentors(id), reason text not null, questions text not null, availability text not null,
  under_18 boolean not null default false, guardian_acknowledgement boolean not null default false,
  status text not null default 'new' check(status in ('new','reviewing','matching','mentor_contacted','scheduled','completed','cancelled','waitlisted')),
  internal_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (not under_18 or guardian_acknowledgement)
);
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(), guidance_request_id uuid not null unique references public.guidance_requests(id), mentor_id uuid not null references public.mentors(id),
  scheduled_start timestamptz not null, scheduled_end timestamptz not null, timezone text not null default 'Asia/Karachi',
  meeting_provider text not null default 'google_meet', meeting_url text not null, calendar_event_id text,
  feedback_token_hash text unique, status text not null default 'proposed' check(status in ('proposed','confirmed','completed','cancelled','no_show_student','no_show_mentor')),
  completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(scheduled_end > scheduled_start)
);
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.sessions(id), respondent_type text not null check(respondent_type in ('student','mentor')),
  overall_rating integer not null check(overall_rating between 1 and 5), clarity_rating integer not null check(clarity_rating between 1 and 5), mentor_rating integer check(mentor_rating between 1 and 5),
  recommend boolean not null, comments text, testimonial text, testimonial_permission boolean not null default false,
  student_attended boolean, additional_guidance_needed boolean, safety_concern text, created_at timestamptz not null default now(), unique(session_id,respondent_type)
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
do $$ declare table_name text; begin foreach table_name in array array['universities','campuses','institutions','degrees','program_offerings','mentors','mentor_applications','guidance_requests','sessions'] loop execute format('drop trigger if exists set_updated_at on public.%I',table_name); execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',table_name); end loop; end $$;

create index if not exists guidance_requests_status_created_idx on public.guidance_requests(status,created_at desc);
create index if not exists guidance_requests_offering_status_idx on public.guidance_requests(offering_id,status);
create index if not exists mentors_offering_status_idx on public.mentors(offering_id,mentor_status,verification_status);
create index if not exists sessions_status_start_idx on public.sessions(status,scheduled_start);
create index if not exists applications_status_created_idx on public.mentor_applications(status,created_at desc);

create or replace view public.public_program_offerings with (security_invoker=true) as
select po.id,po.public_id,po.status,po.launch_term,po.active,po.display_order,po.official_source_url,po.last_verified_at,
  d.name degree_name,d.short_name degree_short_name,d.slug degree_slug,d.category,
  i.name institution_name,i.short_name institution_code,i.slug institution_slug,c.name campus_name,c.slug campus_slug,c.city,
  count(m.id) filter(where m.mentor_status='active' and m.verification_status='verified') mentor_count
from public.program_offerings po join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id
left join public.mentors m on m.offering_id=po.id
where po.active and d.active and i.active and c.active
group by po.id,d.id,i.id,c.id;

create or replace view public.public_mentors with (security_invoker=true) as
select m.id,m.slug,m.full_name,m.semester,m.graduation_year,m.bio,m.languages,m.profile_image_url,m.availability_notes,
  po.public_id offering_public_id,d.short_name degree_short_name,i.short_name institution_code,c.city,
  coalesce(array_agg(mt.name order by mt.name) filter(where mt.id is not null),'{}') topics
from public.mentors m join public.program_offerings po on po.id=m.offering_id join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id
left join public.mentor_topic_links mtl on mtl.mentor_id=m.id left join public.mentor_topics mt on mt.id=mtl.topic_id
where m.mentor_status='active' and m.verification_status='verified' and po.active and po.status='current'
group by m.id,po.public_id,d.short_name,i.short_name,c.city;

create or replace view public.admin_request_queue as
select gr.*,d.short_name degree_short_name,i.short_name institution_code,c.city,m.full_name preferred_mentor_name
from public.guidance_requests gr join public.program_offerings po on po.id=gr.offering_id join public.degrees d on d.id=po.degree_id
join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id left join public.mentors m on m.id=gr.preferred_mentor_id;
create or replace view public.admin_sessions as
select s.*,gr.student_name,gr.student_email,d.short_name degree_short_name,i.short_name institution_code,c.city,m.full_name mentor_name,m.email_private mentor_email
from public.sessions s join public.guidance_requests gr on gr.id=s.guidance_request_id join public.mentors m on m.id=s.mentor_id
join public.program_offerings po on po.id=gr.offering_id join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id;
create or replace view public.admin_mentors as
select m.*,d.short_name degree_short_name,i.short_name institution_code,c.city from public.mentors m join public.program_offerings po on po.id=m.offering_id join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id;
create or replace view public.admin_mentor_applications as
select ma.*,d.short_name degree_short_name,i.short_name institution_code,c.city from public.mentor_applications ma join public.program_offerings po on po.id=ma.offering_id join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id;
create or replace view public.admin_program_offerings as
select po.*,d.name degree_name,d.short_name degree_short_name,d.category,i.short_name institution_code,c.city from public.program_offerings po join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id;
create or replace view public.admin_feedback as
select f.*,gr.student_name,m.full_name mentor_name,d.short_name degree_short_name from public.feedback f join public.sessions s on s.id=f.session_id join public.guidance_requests gr on gr.id=s.guidance_request_id join public.mentors m on m.id=s.mentor_id join public.program_offerings po on po.id=gr.offering_id join public.degrees d on d.id=po.degree_id;
create or replace view public.admin_unmet_demand as
select po.id offering_id,d.short_name degree_short_name,i.short_name institution_code,c.city,
  count(distinct gr.id) filter(where gr.status in ('new','reviewing','matching','mentor_contacted','waitlisted')) open_requests,
  count(distinct m.id) filter(where m.mentor_status='active' and m.verification_status='verified') active_mentors,
  (count(distinct gr.id) filter(where gr.status in ('new','reviewing','matching','mentor_contacted','waitlisted'))::numeric / greatest(count(distinct m.id) filter(where m.mentor_status='active' and m.verification_status='verified'),1)) demand_score
from public.program_offerings po join public.degrees d on d.id=po.degree_id join public.institutions i on i.id=po.institution_id join public.campuses c on c.id=po.campus_id
left join public.guidance_requests gr on gr.offering_id=po.id left join public.mentors m on m.offering_id=po.id group by po.id,d.short_name,i.short_name,c.city;

alter table public.universities enable row level security; alter table public.campuses enable row level security;
alter table public.institutions enable row level security; alter table public.degrees enable row level security;
alter table public.program_offerings enable row level security; alter table public.mentors enable row level security;
alter table public.mentor_topics enable row level security; alter table public.mentor_topic_links enable row level security;
alter table public.mentor_applications enable row level security; alter table public.guidance_requests enable row level security;
alter table public.sessions enable row level security; alter table public.feedback enable row level security; alter table public.admin_users enable row level security;

drop policy if exists "public active universities" on public.universities; create policy "public active universities" on public.universities for select to anon,authenticated using(active);
drop policy if exists "public active campuses" on public.campuses; create policy "public active campuses" on public.campuses for select to anon,authenticated using(active);
drop policy if exists "public active institutions" on public.institutions; create policy "public active institutions" on public.institutions for select to anon,authenticated using(active);
drop policy if exists "public active degrees" on public.degrees; create policy "public active degrees" on public.degrees for select to anon,authenticated using(active);
drop policy if exists "public active offerings" on public.program_offerings; create policy "public active offerings" on public.program_offerings for select to anon,authenticated using(active);
drop policy if exists "public approved mentors" on public.mentors; create policy "public approved mentors" on public.mentors for select to anon,authenticated using(mentor_status='active' and verification_status='verified');
drop policy if exists "public mentor topics" on public.mentor_topics; create policy "public mentor topics" on public.mentor_topics for select to anon,authenticated using(true);
drop policy if exists "public mentor topic links" on public.mentor_topic_links; create policy "public mentor topic links" on public.mentor_topic_links for select to anon,authenticated using(exists(select 1 from public.mentors m where m.id=mentor_id and m.mentor_status='active' and m.verification_status='verified'));
drop policy if exists "admins read own membership" on public.admin_users; create policy "admins read own membership" on public.admin_users for select to authenticated using(auth.uid()=user_id);

grant select on public.public_program_offerings,public.public_mentors to anon,authenticated;
revoke all on public.mentors from anon,authenticated;
grant select(id,offering_id,full_name,slug,semester,graduation_year,bio,languages,profile_image_url,verification_status,mentor_status,availability_notes,created_at,updated_at) on public.mentors to anon,authenticated;
revoke all on public.mentor_applications,public.guidance_requests,public.sessions,public.feedback from anon,authenticated;
revoke all on public.admin_users from anon,authenticated;
grant select on public.admin_users to authenticated;
revoke insert,update,delete,truncate,references,trigger on public.universities,public.campuses,public.institutions,public.degrees,public.program_offerings,public.mentor_topics,public.mentor_topic_links from anon,authenticated;
grant select on public.universities,public.campuses,public.institutions,public.degrees,public.program_offerings,public.mentor_topics,public.mentor_topic_links to anon,authenticated;
revoke all on public.admin_request_queue,public.admin_sessions,public.admin_mentors,public.admin_mentor_applications,public.admin_program_offerings,public.admin_feedback,public.admin_unmet_demand from anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('mentor-images','mentor-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "public mentor image read" on storage.objects; create policy "public mentor image read" on storage.objects for select to anon,authenticated using(bucket_id='mentor-images');
drop policy if exists "admins manage mentor images" on storage.objects; create policy "admins manage mentor images" on storage.objects for all to authenticated using(bucket_id='mentor-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check(bucket_id='mentor-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));

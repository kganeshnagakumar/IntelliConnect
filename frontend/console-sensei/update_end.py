import sys

with open('/home/pavan/Documents/projects/intelli3/frontend/console-sensei/src/pages/dashboard/Meetings.tsx', 'r') as f:
    content = f.read()

# find where we messed up (from ` <MoreHorizontal className="w-5 h-5" />` was deleted)
target_string = '''                <div className="p-3 rounded-xl bg-foreground/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <Video className="w-6 h-6" />
                </div>
                <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/20 transition-colors">
      </div>
    </div>
  );
}'''

replacement = '''                <div className="p-3 rounded-xl bg-foreground/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <Video className="w-6 h-6" />
                </div>
                <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/20 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black mb-2 group-hover:text-brand-blue transition-colors line-clamp-1">{meeting.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(meeting.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {meeting.uploaded_file?.processing_status || 'PENDING'}</span>
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-sm text-foreground/50 line-clamp-2 font-medium leading-relaxed">
                  {meeting.ai_analysis?.context_summary || "No summary available for this session."}
                </p>
              </div>

              <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                <div className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  meeting.uploaded_file?.processing_status === 'COMPLETED' ? "bg-green-500/10 text-green-500" :
                  meeting.uploaded_file?.processing_status === 'PROCESSING' ? "bg-brand-blue/10 text-brand-blue" :
                  "bg-foreground/5 text-foreground/30"
                )}>
                  {meeting.uploaded_file?.processing_status || 'PENDING'}
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/10 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </div>

              {/* Holographic Border Effect */}
              <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-brand-blue/20 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}'''

new_content = content.replace(target_string, replacement)

with open('/home/pavan/Documents/projects/intelli3/frontend/console-sensei/src/pages/dashboard/Meetings.tsx', 'w') as f:
    f.write(new_content)

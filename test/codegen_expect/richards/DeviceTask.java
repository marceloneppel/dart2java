package richards;

public class DeviceTask extends richards.Task
{
    public static dart._runtime.types.simple.InterfaceTypeInfo dart2java$typeInfo = new dart._runtime.types.simple.InterfaceTypeInfo("file:///usr/local/google/home/andrewkrieger/ddc-java/gen/codegen_tests/richards.dart", "DeviceTask");
    static {
      richards.DeviceTask.dart2java$typeInfo.superclass = new dart._runtime.types.simple.InterfaceTypeExpr(richards.Task.dart2java$typeInfo);
    }
    public richards.Packet v1;
  
    public DeviceTask(dart._runtime.types.simple.Type type, richards.Scheduler scheduler)
    {
      super((dart._runtime.helpers.ConstructorHelper.EmptyConstructorMarker) null, type);
      this._constructor(scheduler);
    }
    public DeviceTask(dart._runtime.helpers.ConstructorHelper.EmptyConstructorMarker arg, dart._runtime.types.simple.Type type)
    {
      super(arg, type);
    }
  
    protected void _constructor(richards.Scheduler scheduler)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      super._constructor(scheduler);
    }
    public richards.TaskControlBlock run(richards.Packet packet)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      if (dart._runtime.helpers.ObjectHelper.operatorEqual(packet, null))
      {
        if (dart._runtime.helpers.ObjectHelper.operatorEqual(this.getV1(), null))
        {
          return this.getScheduler().suspendCurrent();
        }
        richards.Packet v = this.getV1();
        this.setV1(null);
        return this.getScheduler().queue(v);
      }
      this.setV1(packet);
      return this.getScheduler().holdCurrent();
    }
    public java.lang.String toString()
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      return "DeviceTask";
    }
    public richards.Packet getV1()
    {
      return this.v1;
    }
    public richards.Packet setV1(richards.Packet value)
    {
      this.v1 = value;
      return value;
    }
}